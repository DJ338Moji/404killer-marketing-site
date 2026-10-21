#!/usr/bin/env python3
"""
404 Killer App: Direct CFO & CMO Forensic Outreach Engine
Author: Dale Johnson (djohnson@404killer.com)
Description: Manages direct cold outreach to CFOs and CMOs of high-growth
             Shopify Plus DTC brands. Cites live 404 dead ends, monthly ad
             spend bleed, and missing product impact, delivering a 1-click
             "Click here to fix it now" audit link.
"""

import os
import sys
import csv
import re
import time
import random
import sqlite3
import smtplib
import imaplib
import argparse
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email import policy
from email.parser import BytesParser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "outreach_crm.sqlite")
CSV_PATH = os.path.join(BASE_DIR, "direct_brands.csv")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

def load_env_file():
    env_path = os.path.join(BASE_DIR, ".env.outreach")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    if k.strip() not in os.environ:
                        os.environ[k.strip()] = v.strip().strip("'\"")

load_env_file()

# Deliverability Configuration
CONFIG = {
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "imap_host": "imap.gmail.com",
    "imap_port": 993,
    "sender_email": os.environ.get("SENDER_EMAIL", "djohnson@404killer.com"),
    "sender_name": os.environ.get("SENDER_NAME", "Dale Johnson"),
    "daily_limit_brands": 15,
    "min_delay_sec": 15,
    "max_delay_sec": 30,
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes brand_leads table and ingests direct_brands.csv."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS brand_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_name TEXT NOT NULL,
        website TEXT NOT NULL,
        domain TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        first_name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        category TEXT,
        estimated_traffic INTEGER,
        sample_404_1 TEXT,
        sample_404_2 TEXT,
        monthly_ad_bleed INTEGER,
        annual_ad_bleed INTEGER,
        missing_products_detail TEXT,
        template_type TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        touch_1_sent_at TIMESTAMP,
        touch_2_sent_at TIMESTAMP,
        next_touch_due TIMESTAMP,
        bounced_at TIMESTAMP,
        bounce_reason TEXT,
        replied_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS brand_send_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_lead_id INTEGER,
        email TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        template_type TEXT NOT NULL,
        subject TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL,
        error_message TEXT,
        FOREIGN KEY (brand_lead_id) REFERENCES brand_leads(id)
    )
    """)
    conn.commit()

    if not os.path.exists(CSV_PATH):
        print(f"❌ Error: CSV not found at {CSV_PATH}")
        conn.close()
        return

    imported_count = 0
    with open(CSV_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row.get("Email", "").strip().lower()
            if not email or "@" not in email:
                continue

            website = row.get("Website", "").strip()
            domain = re.sub(r"^https?://(www\.)?", "", website).strip("/").split("/")[0]

            contact_name = row.get("Contact Name", "").strip()
            first_name = contact_name.split()[0] if contact_name else "there"
            if first_name.lower() in ["team", "leadership", "growth"]:
                first_name = "there"

            role = row.get("Role", "").strip()
            # If role contains Finance/CFO/COO -> CFO pitch; else -> CMO pitch
            is_cfo = any(k in role.lower() for k in ["cfo", "finance", "financial", "coo", "accounting"])
            template_type = "cfo" if is_cfo else "cmo"

            try:
                monthly_bleed = int(row.get("Monthly Ad Bleed", "1850").replace("$", "").replace(",", ""))
            except ValueError:
                monthly_bleed = 1850

            annual_bleed = monthly_bleed * 12

            try:
                traffic = int(row.get("Estimated Traffic", "1000000").replace(",", ""))
            except ValueError:
                traffic = 1000000

            try:
                cursor.execute("""
                INSERT OR IGNORE INTO brand_leads (
                    brand_name, website, domain, contact_name, first_name,
                    role, email, category, estimated_traffic, sample_404_1,
                    sample_404_2, monthly_ad_bleed, annual_ad_bleed,
                    missing_products_detail, template_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    row.get("Brand Name", "").strip(),
                    website,
                    domain,
                    contact_name,
                    first_name,
                    role,
                    email,
                    row.get("Category", "").strip(),
                    traffic,
                    row.get("Sample 404 Path 1", "").strip(),
                    row.get("Sample 404 Path 2", "").strip(),
                    monthly_bleed,
                    annual_bleed,
                    row.get("Missing Products Detail", "").strip(),
                    template_type
                ))
                if cursor.rowcount > 0:
                    imported_count += 1
            except Exception as e:
                print(f"Error inserting row {email}: {e}")

    conn.commit()
    conn.close()
    print(f"✅ Brand CRM initialized. Ingested {imported_count} direct brand leads from {CSV_PATH}.")

def format_brand_variables(lead):
    return {
        "first_name": lead["first_name"],
        "contact_name": lead["contact_name"],
        "brand_name": lead["brand_name"],
        "website": lead["website"],
        "domain": lead["domain"],
        "role": lead["role"],
        "category": lead["category"] or "DTC E-Commerce",
        "sample_404_1": lead["sample_404_1"] or "/products/sample-discontinued-sku",
        "sample_404_2": lead["sample_404_2"] or "/collections/seasonal-sale-archive",
        "monthly_ad_bleed": f"{lead['monthly_ad_bleed']:,}",
        "annual_ad_bleed": f"{lead['annual_ad_bleed']:,}",
        "missing_products_detail": lead["missing_products_detail"] or "Discontinued seasonal catalog routes returning 404",
    }

def render_brand_template(template_type, variables, fmt="txt"):
    filename = f"brand_{template_type}_audit.{fmt}"
    filepath = os.path.join(TEMPLATES_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Template not found: {filepath}")

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    for k, v in variables.items():
        content = content.replace(f"{{{{{k}}}}}", str(v))

    subject = ""
    body = content
    if content.startswith("Subject:"):
        lines = content.split("\n", 1)
        subject = lines[0].replace("Subject:", "").strip()
        body = lines[1].lstrip("\n") if len(lines) > 1 else ""

    return subject, body

def show_status():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM brand_leads")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT status, COUNT(*) FROM brand_leads GROUP BY status")
    status_counts = dict(cursor.fetchall())

    cursor.execute("SELECT template_type, COUNT(*) FROM brand_leads GROUP BY template_type")
    type_counts = dict(cursor.fetchall())

    today_start = datetime.now().strftime("%Y-%m-%d 00:00:00")
    cursor.execute("SELECT COUNT(*) FROM brand_send_logs WHERE sent_at >= ? AND status = 'SUCCESS'", (today_start,))
    sent_today = cursor.fetchone()[0]

    conn.close()

    print("\n" + "="*58)
    print("📊 404 KILLER APP — DIRECT BRAND CFO & CMO OUTREACH STATUS")
    print("="*58)
    print(f"Total Curated Brands:    {total}")
    print(f"CFO Pitches (P&L Focus): {type_counts.get('cfo', 0)}")
    print(f"CMO Pitches (ROAS Focus):{type_counts.get('cmo', 0)}")
    print(f"Emails Sent Today:       {sent_today} / {CONFIG['daily_limit_brands']} (Daily Warmup Safe Limit)")
    print("-" * 58)
    print(f"⏳ Pending (Uncontacted): {status_counts.get('PENDING', 0)}")
    print(f"📤 Touch 1 Sent:          {status_counts.get('TOUCH_1_SENT', 0)}")
    print(f"🔥 Replied (Interested):  {status_counts.get('REPLIED', 0)}")
    print(f"⚠️  Bounced:               {status_counts.get('BOUNCED', 0)}")
    print("="*58 + "\n")

def dry_run(limit=5):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM brand_leads 
    WHERE status = 'PENDING'
    ORDER BY id ASC LIMIT ?
    """, (limit,))
    leads = cursor.fetchall()
    conn.close()

    if not leads:
        print("No pending brand leads found for outreach.")
        return

    print(f"\n🧪 DRY RUN: PREVIEWING NEXT {len(leads)} BRAND FORENSIC OUTREACH EMAILS")
    print("=" * 64)

    for i, lead in enumerate(leads, 1):
        vars = format_brand_variables(lead)
        tmpl_type = lead["template_type"]
        subject, text_body = render_brand_template(tmpl_type, vars, "txt")

        print(f"\n--- [Preview {i}/{len(leads)}] ---")
        print(f"Target:       {lead['brand_name']} ({lead['domain']})")
        print(f"Recipient:    {lead['contact_name']} <{lead['email']}>")
        print(f"Role / Pitch: {lead['role']} ➔ [{tmpl_type.upper()} Template]")
        print(f"Est Bleed:    ${lead['monthly_ad_bleed']:,}/mo")
        print(f"Fix Link:     https://404killer.com/audit?store={lead['domain']}")
        print(f"Subject:      {subject}")
        print("-" * 45)
        print(text_body.strip())
        print("-" * 64)

def send_test_email(recipient="djohnson@404killer.com", brand_id=1, app_password=None):
    """Sends a real forensic test email to Dale Johnson for manual review."""
    password = app_password or os.environ.get("OUTREACH_APP_PASSWORD")
    if not password:
        print("❌ Error: No OUTREACH_APP_PASSWORD found in environment or .env.outreach.")
        return

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM brand_leads WHERE id = ?", (brand_id,))
    lead = cursor.fetchone()
    if not lead:
        cursor.execute("SELECT * FROM brand_leads ORDER BY id ASC LIMIT 1")
        lead = cursor.fetchone()
    conn.close()

    if not lead:
        print("❌ No brand lead found in database.")
        return

    vars = format_brand_variables(lead)
    tmpl_type = lead["template_type"]
    subject, text_body = render_brand_template(tmpl_type, vars, "txt")
    _, html_body = render_brand_template(tmpl_type, vars, "html")

    subject = f"[PREVIEW TEST] {subject}"

    msg = MIMEMultipart("alternative")
    msg["From"] = f"{CONFIG['sender_name']} <{CONFIG['sender_email']}>"
    msg["To"] = recipient
    msg["Subject"] = subject
    msg["Reply-To"] = CONFIG["sender_email"]

    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    print(f"🚀 Sending live test preview to {recipient} ({lead['brand_name']} {tmpl_type.upper()} audit)...")

    try:
        server = smtplib.SMTP(CONFIG["smtp_host"], CONFIG["smtp_port"])
        server.starttls()
        server.login(CONFIG["sender_email"], password)
        server.send_message(msg)
        server.quit()
        print(f"✅ Success! Live test email delivered to {recipient}.")
        print(f"Check your inbox to inspect formatting and verify the 'Click here to fix it now' link.")
    except Exception as e:
        print(f"❌ Failed to send test email: {e}")

def send_brand_batch(limit=5, instant=False, app_password=None):
    """Dispatches real outreach to pending brands with deliverability warmup pacing."""
    password = app_password or os.environ.get("OUTREACH_APP_PASSWORD")
    if not password:
        print("❌ Error: No OUTREACH_APP_PASSWORD found in environment.")
        return

    conn = get_db()
    cursor = conn.cursor()

    today_start = datetime.now().strftime("%Y-%m-%d 00:00:00")
    cursor.execute("SELECT COUNT(*) FROM brand_send_logs WHERE sent_at >= ? AND status = 'SUCCESS'", (today_start,))
    sent_today = cursor.fetchone()[0]

    daily_ceiling = CONFIG["daily_limit_brands"]
    if sent_today >= daily_ceiling:
        print(f"🛑 Daily warmup safety limit reached ({sent_today}/{daily_ceiling} sent today).")
        conn.close()
        return

    allowed = min(limit, daily_ceiling - sent_today)
    print(f"🚀 Preparing to dispatch up to {allowed} direct brand forensic email(s)...")

    cursor.execute("""
    SELECT * FROM brand_leads 
    WHERE status = 'PENDING'
    ORDER BY id ASC LIMIT ?
    """, (allowed,))
    queue = cursor.fetchall()

    if not queue:
        print("📭 No pending brand leads ready for dispatch.")
        conn.close()
        return

    try:
        server = smtplib.SMTP(CONFIG["smtp_host"], CONFIG["smtp_port"])
        server.starttls()
        server.login(CONFIG["sender_email"], password)
    except Exception as e:
        print(f"❌ SMTP connection failed: {e}")
        conn.close()
        return

    sent_count = 0
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for i, lead in enumerate(queue, 1):
        vars = format_brand_variables(lead)
        tmpl_type = lead["template_type"]
        subject, text_body = render_brand_template(tmpl_type, vars, "txt")
        _, html_body = render_brand_template(tmpl_type, vars, "html")

        target_email = lead["email"]
        msg = MIMEMultipart("alternative")
        msg["From"] = f"{CONFIG['sender_name']} <{CONFIG['sender_email']}>"
        msg["To"] = f"{lead['contact_name']} <{target_email}>"
        msg["Subject"] = subject
        msg["Reply-To"] = CONFIG["sender_email"]

        msg.attach(MIMEText(text_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        print(f"\n[{i}/{len(queue)}] Dispatching forensic audit to: {lead['brand_name']} ({lead['domain']})")
        print(f"    Recipient: {lead['contact_name']} <{target_email}> | Role: {lead['role']}")
        print(f"    Subject:   {subject}")

        try:
            server.send_message(msg)
            print("    ✅ DELIVERED cleanly via Google Workspace SMTP.")

            next_touch = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("""
            UPDATE brand_leads SET 
                status = 'TOUCH_1_SENT',
                touch_1_sent_at = ?,
                next_touch_due = ?,
                updated_at = ?
            WHERE id = ?
            """, (now_str, next_touch, now_str, lead["id"]))

            cursor.execute("""
            INSERT INTO brand_send_logs (
                brand_lead_id, email, brand_name, template_type, subject, status
            ) VALUES (?, ?, ?, ?, ?, 'SUCCESS')
            """, (lead["id"], target_email, lead["brand_name"], tmpl_type, subject))

            conn.commit()
            sent_count += 1

        except Exception as e:
            print(f"    ❌ SEND FAILED: {e}")
            cursor.execute("""
            INSERT INTO brand_send_logs (
                brand_lead_id, email, brand_name, template_type, subject, status, error_message
            ) VALUES (?, ?, ?, ?, ?, 'FAILED', ?)
            """, (lead["id"], target_email, lead["brand_name"], tmpl_type, subject, str(e)))
            conn.commit()

        if i < len(queue) and not instant:
            delay = random.randint(CONFIG["min_delay_sec"], CONFIG["max_delay_sec"])
            print(f"    ⏳ Pacing pause: waiting {delay}s to protect domain sender reputation...")
            time.sleep(delay)

    server.quit()
    conn.close()
    print(f"\n🏁 Batch dispatch complete. Successfully sent: {sent_count} / {len(queue)} emails.")

def check_inbox(app_password=None):
    """Scans IMAP for replies and delivery failure notices from brand targets."""
    password = app_password or os.environ.get("OUTREACH_APP_PASSWORD")
    if not password:
        print("❌ Error: No Google Workspace App Password found.")
        return

    print(f"📡 Connecting to IMAP ({CONFIG['imap_host']}) as {CONFIG['sender_email']}...")
    try:
        mail = imaplib.IMAP4_SSL(CONFIG["imap_host"], CONFIG["imap_port"])
        mail.login(CONFIG["sender_email"], password)
        mail.select("INBOX")
    except Exception as e:
        print(f"❌ IMAP connection failed: {e}")
        return

    status, messages = mail.search(None, "ALL")
    if status != "OK" or not messages[0]:
        print("📭 Inbox empty or no messages found.")
        mail.logout()
        return

    email_ids = messages[0].split()
    print(f"🔍 Scanning last {min(len(email_ids), 30)} messages for brand replies and bounces...")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, brand_name FROM brand_leads WHERE status = 'TOUCH_1_SENT'")
    active_brands = {row["email"].lower(): row for row in cursor.fetchall()}

    bounces_found = 0
    replies_found = 0

    for eid in email_ids[-30:]:
        res, msg_data = mail.fetch(eid, "(RFC822)")
        if res != "OK":
            continue

        raw = msg_data[0][1]
        msg = BytesParser(policy=policy.default).parsebytes(raw)
        sender = str(msg.get("From", "")).lower()
        subject = str(msg.get("Subject", "")).lower()
        body = msg.get_body(preferencelist=('plain',)).get_content().lower() if msg.get_body() else ""

        is_bounce = any(k in sender for k in ["mailer-daemon", "postmaster", "mail-noreply"]) or \
                    any(k in subject for k in ["failure", "undeliverable", "returned mail", "not found"])

        if is_bounce:
            for active_email, brand in active_brands.items():
                if active_email in body or active_email in subject:
                    print(f"⚠️  BOUNCE DETECTED for: {brand['brand_name']} <{active_email}>")
                    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    cursor.execute("""
                    UPDATE brand_leads SET status = 'BOUNCED', bounced_at = ?, bounce_reason = 'Delivery failure', updated_at = ?
                    WHERE id = ?
                    """, (now_str, now_str, brand["id"]))
                    conn.commit()
                    bounces_found += 1
                    break

        for active_email, brand in active_brands.items():
            if active_email in sender:
                print(f"🔥 INBOUND BRAND REPLY from: {brand['brand_name']} ({active_email})!")
                print(f"Subject: {msg.get('Subject')}")
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute("""
                UPDATE brand_leads SET status = 'REPLIED', replied_at = ?, updated_at = ?
                WHERE id = ?
                """, (now_str, now_str, brand["id"]))
                conn.commit()
                replies_found += 1
                break

    mail.logout()
    conn.close()
    print(f"✅ Inbox check complete. Bounces: {bounces_found}, Brand Replies: {replies_found}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="404 Killer App: Brand CFO & CMO Forensic Outreach Engine")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")

    subparsers.add_parser("init-db", help="Initialize SQLite tables and ingest direct_brands.csv")
    subparsers.add_parser("status", help="Show current CRM pipeline status")

    dry_parser = subparsers.add_parser("dry-run", help="Simulate email generation without sending")
    dry_parser.add_argument("--limit", type=int, default=3, help="Number of preview emails to generate")

    test_parser = subparsers.add_parser("test-send", help="Send a real test email to verify formatting")
    test_parser.add_argument("--recipient", type=str, default="djohnson@404killer.com", help="Test recipient address")
    test_parser.add_argument("--brand-id", type=int, default=1, help="Brand ID to test with")
    test_parser.add_argument("--password", type=str, help="Google Workspace App Password")

    send_parser = subparsers.add_parser("send", help="Dispatch live outreach to pending brands")
    send_parser.add_argument("--limit", type=int, default=5, help="Number of emails to send")
    send_parser.add_argument("--instant", action="store_true", help="Skip pacing pauses (testing only)")
    send_parser.add_argument("--password", type=str, help="Google Workspace App Password")

    check_parser = subparsers.add_parser("check-inbox", help="Scan IMAP for replies and bounces")
    check_parser.add_argument("--password", type=str, help="Google Workspace App Password")

    args = parser.parse_args()

    if args.command == "init-db":
        init_db()
    elif args.command == "status":
        show_status()
    elif args.command == "dry-run":
        dry_run(limit=args.limit)
    elif args.command == "test-send":
        send_test_email(recipient=args.recipient, brand_id=args.brand_id, app_password=args.password)
    elif args.command == "send":
        send_brand_batch(limit=args.limit, instant=args.instant, app_password=args.password)
    elif args.command == "check-inbox":
        check_inbox(app_password=args.password)
    else:
        show_status()
