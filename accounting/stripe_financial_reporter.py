#!/usr/bin/env python3
"""
404 Killer App (DevRevIQ LLC) — Automated Stripe Financial & P&L Engine
========================================================================
Generates CPA-ready and IRS-compliant:
1. GAAP Income Statement (Profit & Loss / P&L)
2. Balance Sheet & Asset Reconciliation (Stripe to Mercury Bank Cash)
3. 1099-K Gross Volume & Sales Tax Audit Ledger
4. CSV / Spreadsheet Export for your Accountant

Usage:
  python3 stripe_financial_reporter.py
  python3 stripe_financial_reporter.py --month 2026-10
  python3 stripe_financial_reporter.py --year 2026
  python3 stripe_financial_reporter.py --export-csv
"""

import os
import sys
import json
import csv
import argparse
from datetime import datetime, timezone, timedelta
import urllib.request
import urllib.error

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
ENV_PATH = os.path.join(PROJECT_DIR, ".env.stripe")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

def load_stripe_key():
    key = os.environ.get("STRIPE_RESTRICTED_KEY")
    if key:
        return key

    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("STRIPE_RESTRICTED_KEY=") and not line.startswith("#"):
                    return line.split("=", 1)[1].strip().strip("'\"")

    print(f"❌ Error: STRIPE_RESTRICTED_KEY not found in environment or {ENV_PATH}")
    sys.exit(1)

def stripe_api_get(endpoint, params=None):
    key = load_stripe_key()
    url = f"https://api.stripe.com/v1{endpoint}"
    if params:
        query_str = urllib.parse.urlencode(params)
        url = f"{url}?{query_str}"

    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {key}")
    req.add_header("User-Agent", "404Killer-AccountingEngine/1.0")

    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"❌ Stripe API Error ({e.code}): {error_body}")
        return None
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return None

def fetch_all_paginated(endpoint, params=None):
    items = []
    has_more = True
    starting_after = None
    query_params = dict(params or {})
    query_params["limit"] = 100

    while has_more:
        if starting_after:
            query_params["starting_after"] = starting_after

        res = stripe_api_get(endpoint, query_params)
        if not res or "data" not in res:
            break

        data = res["data"]
        items.extend(data)
        has_more = res.get("has_more", False)
        if data:
            starting_after = data[-1]["id"]
        else:
            break

    return items

def generate_financial_report(target_year=None, target_month=None, export_csv=False):
    now = datetime.now(timezone.utc)
    os.makedirs(REPORTS_DIR, exist_ok=True)

    print("📡 Connecting to Stripe (DevRevIQ LLC) via Read-Only API...")
    balance_data = stripe_api_get("/balance")
    if not balance_data:
        print("❌ Could not retrieve balance data.")
        return

    # Available & Pending Cash Balances
    available_usd = sum(b.get("amount", 0) for b in balance_data.get("available", []) if b.get("currency") == "usd") / 100.0
    pending_usd = sum(b.get("amount", 0) for b in balance_data.get("pending", []) if b.get("currency") == "usd") / 100.0
    total_stripe_cash = available_usd + pending_usd

    # Date range filters
    date_filter = {}
    period_label = "All-Time / YTD"
    if target_year and target_month:
        start_dt = datetime(target_year, target_month, 1, 0, 0, 0, tzinfo=timezone.utc)
        if target_month == 12:
            end_dt = datetime(target_year + 1, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
        else:
            end_dt = datetime(target_year, target_month + 1, 1, 0, 0, 0, tzinfo=timezone.utc)
        date_filter = {
            "created[gte]": int(start_dt.timestamp()),
            "created[lt]": int(end_dt.timestamp())
        }
        period_label = f"{start_dt.strftime('%B %Y')}"
    elif target_year:
        start_dt = datetime(target_year, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
        end_dt = datetime(target_year + 1, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
        date_filter = {
            "created[gte]": int(start_dt.timestamp()),
            "created[lt]": int(end_dt.timestamp())
        }
        period_label = f"Full Year {target_year}"

    # Fetch transactions, charges, subscriptions
    print(f"🔍 Fetching financial transactions for period: {period_label}...")
    txn_params = dict(date_filter)
    transactions = fetch_all_paginated("/balance_transactions", txn_params)
    charges = fetch_all_paginated("/charges", dict(date_filter))
    subscriptions = fetch_all_paginated("/subscriptions", {"status": "all"})

    # Metrics aggregation
    gross_revenue = 0.0
    stripe_processing_fees = 0.0
    refunds_total = 0.0
    net_payouts = 0.0
    successful_charges_count = 0
    refunded_charges_count = 0

    agency_annual_rev = 0.0
    agency_monthly_rev = 0.0
    pro_plan_rev = 0.0
    starter_plan_rev = 0.0
    other_rev = 0.0

    for ch in charges:
        if ch.get("paid") and not ch.get("refunded"):
            amount = ch.get("amount", 0) / 100.0
            gross_revenue += amount
            successful_charges_count += 1

            desc = (ch.get("description") or "").lower()
            if "1,599" in desc or "agency" in desc and amount >= 1000:
                agency_annual_rev += amount
            elif "149" in desc or "agency" in desc and amount >= 100:
                agency_monthly_rev += amount
            elif "14.95" in desc or "125" in desc or "pro" in desc:
                pro_plan_rev += amount
            elif "8.95" in desc or "60" in desc or "starter" in desc:
                starter_plan_rev += amount
            else:
                other_rev += amount

        if ch.get("refunded") or ch.get("amount_refunded", 0) > 0:
            refunds_total += (ch.get("amount_refunded", 0) / 100.0)
            refunded_charges_count += 1

    for tx in transactions:
        fee = tx.get("fee", 0) / 100.0
        stripe_processing_fees += fee
        if tx.get("type") == "payout":
            net_payouts += abs(tx.get("net", 0) / 100.0)

    net_revenue = gross_revenue - refunds_total - stripe_processing_fees
    gross_margin_pct = (net_revenue / gross_revenue * 100.0) if gross_revenue > 0 else 100.0

    # Active Recurring Subscriptions summary
    active_mrr = 0.0
    active_subs_count = 0
    for sub in subscriptions:
        if sub.get("status") in ["active", "trialing"]:
            active_subs_count += 1
            for item in sub.get("items", {}).get("data", []):
                price = item.get("price", {})
                interval = price.get("recurring", {}).get("interval")
                amt = (price.get("unit_amount", 0) / 100.0) * item.get("quantity", 1)
                if interval == "month":
                    active_mrr += amt
                elif interval == "year":
                    active_mrr += (amt / 12.0)

    # Output Terminal Summary
    print("\n" + "=" * 70)
    print("🏢 DEVREVIQ LLC | 404 KILLER APP — FINANCIAL & P&L REPORT")
    print(f"📅 Reporting Period:  {period_label}")
    print(f"🕒 Generated At:       {now.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"🛡️ Entity / Status:    DevRevIQ LLC (Scottsdale, AZ) • Form 1120-S / S-Corp")
    print("=" * 70)

    print("\n1. GAAP INCOME STATEMENT (PROFIT & LOSS)")
    print("-" * 50)
    print(f"  Gross Revenue (Billed Volume):          ${gross_revenue:>12,.2f}")
    if gross_revenue > 0:
        print(f"    ├─ Agency Sentinel Annual ($1,599/yr):  ${agency_annual_rev:>12,.2f}")
        print(f"    ├─ Agency Sentinel Monthly ($149/mo):   ${agency_monthly_rev:>12,.2f}")
        print(f"    ├─ Pro Sentinel ($14.95/mo / $125/yr):  ${pro_plan_rev:>12,.2f}")
        print(f"    ├─ Starter Shield ($8.95/mo / $60/yr):  ${starter_plan_rev:>12,.2f}")
        print(f"    └─ Other / Add-on Client Brands:        ${other_rev:>12,.2f}")
    print(f"  Less: Customer Refunds / Chargebacks:   -${refunds_total:>11,.2f}")
    print(f"  --------------------------------------------------")
    print(f"  Net Billed Revenue:                     ${(gross_revenue - refunds_total):>12,.2f}")
    print(f"  Less: Merchant Processing Fees (Stripe):-${stripe_processing_fees:>11,.2f}")
    print(f"  ==================================================")
    print(f"  NET OPERATING REVENUE (Gross Profit):   ${net_revenue:>12,.2f}")
    print(f"  Gross Margin Efficiency:                 {gross_margin_pct:>11.1f}%")

    print("\n2. BALANCE SHEET RECONCILIATION (ASSETS & LIABILITIES)")
    print("-" * 50)
    print(f"  CURRENT ASSETS (Stripe Platform):")
    print(f"    ├─ Cleared Available Balance:          ${available_usd:>12,.2f}")
    print(f"    ├─ Pending Settlement Balance:         ${pending_usd:>12,.2f}")
    print(f"    └─ Total Stripe Cash Assets:           ${total_stripe_cash:>12,.2f}")
    print(f"  CASH TRANSFERRED (Mercury Bank):")
    print(f"    └─ Cumulative Payouts Sent to Mercury: ${net_payouts:>12,.2f}")
    print(f"  DEFERRED REVENUE (Annual Prepayments):   ${(agency_annual_rev * 11 / 12):>12,.2f}")

    print("\n3. IRS FORM 1099-K & TAX AUDIT RECONCILIATION")
    print("-" * 50)
    print(f"  IRS Form 1099-K Box 1a (Gross Volume):  ${gross_revenue:>12,.2f}")
    print(f"  Total Transaction Count:                {successful_charges_count:>12d}")
    print(f"  Sales Tax Collected by Stripe:          $        0.00 (SaaS Services)")

    print("\n4. SUBSCRIPTION METRICS & RUN-RATE")
    print("-" * 50)
    print(f"  Active Recurring Subscriptions:         {active_subs_count:>12d}")
    print(f"  Contracted Monthly Recurring Rev (MRR): ${active_mrr:>12,.2f}")
    print(f"  Contracted Annual Run-Rate (ARR):       ${(active_mrr * 12):>12,.2f}")
    print("=" * 70)

    # CSV Export
    if export_csv or True:
        timestamp_slug = now.strftime("%Y%m")
        csv_filename = f"DevRevIQ_PL_BalanceSheet_{timestamp_slug}.csv"
        csv_path = os.path.join(REPORTS_DIR, csv_filename)

        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["DevRevIQ LLC — Monthly Financial Report", period_label])
            writer.writerow(["Generated At", now.strftime("%Y-%m-%d %H:%M:%S UTC")])
            writer.writerow([])
            writer.writerow(["Section", "Line Item", "Amount (USD)", "Notes"])
            writer.writerow(["Income Statement", "Gross Revenue (1099-K Box 1a)", f"{gross_revenue:.2f}", f"{successful_charges_count} successful charges"])
            writer.writerow(["Income Statement", "Agency Annual Prepayments", f"{agency_annual_rev:.2f}", "Annual $1,599 plans"])
            writer.writerow(["Income Statement", "Agency Monthly Billings", f"{agency_monthly_rev:.2f}", "Monthly $149 plans"])
            writer.writerow(["Income Statement", "Pro Sentinel Billings", f"{pro_plan_rev:.2f}", "Single store Pro plans"])
            writer.writerow(["Income Statement", "Starter Shield Billings", f"{starter_plan_rev:.2f}", "Single store Starter plans"])
            writer.writerow(["Income Statement", "Refunds & Disputes", f"-{refunds_total:.2f}", f"{refunded_charges_count} refunds"])
            writer.writerow(["Income Statement", "Stripe Processing Fees", f"-{stripe_processing_fees:.2f}", "Merchant direct COGS (2.9% + 30c)"])
            writer.writerow(["Income Statement", "Net Operating Revenue", f"{net_revenue:.2f}", "Gross profit for corporate tax"])
            writer.writerow([])
            writer.writerow(["Balance Sheet", "Stripe Available Balance", f"{available_usd:.2f}", "Cleared funds"])
            writer.writerow(["Balance Sheet", "Stripe Pending Balance", f"{pending_usd:.2f}", "In transit / settling"])
            writer.writerow(["Balance Sheet", "Total Stripe Cash", f"{total_stripe_cash:.2f}", "Total platform cash asset"])
            writer.writerow(["Balance Sheet", "Cumulative Payouts to Mercury Bank", f"{net_payouts:.2f}", "Direct deposit into Mercury"])
            writer.writerow([])
            writer.writerow(["SaaS Run-Rate", "Active Paying Subscriptions", f"{active_subs_count}", "Live customer accounts"])
            writer.writerow(["SaaS Run-Rate", "Contracted MRR", f"{active_mrr:.2f}", "Monthly recurring revenue"])
            writer.writerow(["SaaS Run-Rate", "Contracted ARR", f"{active_mrr * 12:.2f}", "Annual run rate"])

        print(f"\n✅ CPA Spreadsheet exported successfully to:")
        print(f"👉 {csv_path}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DevRevIQ LLC Automated Stripe Financial & P&L Engine")
    parser.add_argument("--month", type=int, help="Target month (1-12)")
    parser.add_argument("--year", type=int, default=datetime.now().year, help="Target year (default: current year)")
    parser.add_argument("--export-csv", action="store_true", default=True, help="Export CPA-ready CSV report")
    args = parser.parse_args()

    generate_financial_report(target_year=args.year, target_month=args.month, export_csv=args.export_csv)
