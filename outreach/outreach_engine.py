#!/usr/bin/env python3
"""
404 Killer App: Autonomous Agency Outreach & Deliverability Engine
Author: Dale Johnson (djohnson@404killer.com)
Description: Manages cold outreach cadence, daily volume warm-up limits,
             spacing, bounce-back detection, alternate contact fallbacks,
             and reply tracking for DTC performance agencies.
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
CSV_PATH = os.path.join(BASE_DIR, "100_agency_outreach_list.csv")
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


# Default Deliverability Configuration
DEFAULT_CONFIG = {
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "imap_host": "imap.gmail.com",
    "imap_port": 993,
    "sender_email": "djohnson@404killer.com",
    "sender_name": "Dale Johnson",
    "daily_limit_week1": 10,
    "daily_limit_week2": 25,
    "daily_limit_mature": 45,
    "min_delay_sec": 480,  # 8 minutes
    "max_delay_sec": 900,  # 15 minutes
    "touch_2_delay_days": 3,
    "touch_3_delay_days": 5,
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes SQLite database and ingests agency CSV."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agency_name TEXT NOT NULL,
        website TEXT,
        contact_name TEXT,
        role TEXT,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        location TEXT,
        specialization TEXT,
        client_stores TEXT,
        status TEXT DEFAULT 'PENDING',
        touch_1_sent_at TIMESTAMP,
        touch_2_sent_at TIMESTAMP,
        touch_3_sent_at TIMESTAMP,
        next_touch_due TIMESTAMP,
        bounced_at TIMESTAMP,
        bounce_reason TEXT,
        alternative_email TEXT,
        replied_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS send_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER,
        email TEXT NOT NULL,
        touch_stage INTEGER NOT NULL,
        subject TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL,
        error_message TEXT,
        FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
    """)

    conn.commit()

    if not os.path.exists(CSV_PATH):
        print(f"❌ Error: CSV file not found at {CSV_PATH}")
        return

    imported_count = 0
    with open(CSV_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row.get("Direct / Outreach Email", "").strip().lower()
            if not email or "@" not in email:
                continue

            try:
                cursor.execute("""
                INSERT OR IGNORE INTO leads (
                    agency_name, website, contact_name, role, email,
                    phone, location, specialization, client_stores
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    row.get("Agency Name", "").strip(),
                    row.get("Website", "").strip(),
                    row.get("Primary Contact", "").strip(),
                    row.get("Role / Title", "").strip(),
                    email,
                    row.get("Phone Number", "").strip(),
                    row.get("HQ Location", "").strip(),
                    row.get("Specialization", "").strip(),
                    row.get("Estimated Client Stores", "").strip(),
                ))
                if cursor.rowcount > 0:
                    imported_count += 1
            except Exception as e:
                pass

    conn.commit()
    conn.close()
    print(f"✅ Database initialized. Imported {imported_count} new leads into {DB_PATH}.")

def get_sent_today_count():
    conn = get_db()
    cursor = conn.cursor()
    today_start = datetime.now().strftime("%Y-%m-%d 00:00:00")
    cursor.execute("SELECT COUNT(*) FROM send_logs WHERE sent_at >= ? AND status = 'SUCCESS'", (today_start,))
    count = cursor.fetchone()[0]
    conn.close()
    return count

def format_lead_variables(lead):
    full_name = (lead["contact_name"] or "").strip()
    first_name = "there"
    if full_name:
        parts = full_name.split()
        if len(parts) > 0 and parts[0].lower() not in ["agency", "director", "partnerships", "hello", "team", "the"]:
            first_name = parts[0]

    specialization = (lead["specialization"] or "high-growth DTC performance").strip()
    agency_name = (lead["agency_name"] or "your agency").strip()

    return {
        "first_name": first_name,
        "contact_name": full_name or "Partner",
        "agency_name": agency_name,
        "website": lead["website"] or "",
        "specialization": specialization,
        "client_stores": lead["client_stores"] or "20+",
    }

def render_template(stage, variables, fmt="txt"):
    filename = f"touch_{stage}.{fmt}"
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

    cursor.execute("SELECT COUNT(*) FROM leads")
    total_leads = cursor.fetchone()[0]

    cursor.execute("SELECT status, COUNT(*) FROM leads GROUP BY status")
    status_counts = dict(cursor.fetchall())

    sent_today = get_sent_today_count()

    print("\n" + "="*50)
    print("📊 404 KILLER APP — AGENCY OUTREACH CRM STATUS")
    print("="*50)
    print(f"Total Curated Agencies:  {total_leads}")
    print(f"Emails Sent Today:       {sent_today} / 10 (Week 1 Warmup Limit)")
    print("-" * 50)
    print(f"⏳ Pending (Uncontacted): {status_counts.get('PENDING', 0)}")
    print(f"📤 Touch 1 Sent:          {status_counts.get('TOUCH_1_SENT', 0)}")
    print(f"📤 Touch 2 Sent:          {status_counts.get('TOUCH_2_SENT', 0)}")
    print(f"📤 Touch 3 Sent:          {status_counts.get('TOUCH_3_SENT', 0)}")
    print(f"🔥 Replied (Interested):  {status_counts.get('REPLIED', 0)}")
    print(f"⚠️  Bounced:               {status_counts.get('BOUNCED', 0)}")
    print(f"🔄 Queued for Alt Retry:  {status_counts.get('RETRY_QUEUED', 0)}")
    print(f"🏁 Completed (No Reply):  {status_counts.get('COMPLETED', 0)}")
    print("="*50 + "\n")
    conn.close()

def dry_run(limit=3):
    """Simulates the next N emails that would be sent without contacting network."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM leads 
    WHERE status = 'PENDING' OR (status = 'RETRY_QUEUED' AND alternative_email IS NOT NULL)
    ORDER BY id ASC LIMIT ?
    """, (limit,))
    leads = cursor.fetchall()
    conn.close()

    if not leads:
        print("No pending leads found for outreach.")
        return

    print(f"\n🧪 DRY RUN: PREVIEWING NEXT {len(leads)} OUTREACH EMAILS (No real emails sent)")
    print("=" * 60)

    for i, lead in enumerate(leads, 1):
        target_email = lead["alternative_email"] if lead["status"] == "RETRY_QUEUED" else lead["email"]
        vars = format_lead_variables(lead)
        subject, text_body = render_template(1, vars, "txt")

        print(f"\n--- [Preview {i}/{len(leads)}] ---")
        print(f"Recipient:  {lead['contact_name']} <{target_email}>")
        print(f"Agency:     {lead['agency_name']} ({lead['website']})")
        print(f"Role:       {lead['role']}")
        print(f"Stage:      Touch 1 (Live Audit & Bleed Hook)")
        print(f"Subject:    {subject}")
        print("-" * 40)
        print(text_body.strip())
        print("-" * 60)

def derive_alternative_email(agency_name, website, failed_email):
    """Derives high-probability fallback email addresses for an agency."""
    domain = ""
    if website:
        domain = re.sub(r"^https?://(www\.)?", "", website).strip("/").split("/")[0]
    elif failed_email and "@" in failed_email:
        domain = failed_email.split("@")[1]

    if not domain:
        return None

    # Priority order for fallback agency inboxes
    fallbacks = [
        f"partnerships@{domain}",
        f"hello@{domain}",
        f"contact@{domain}",
        f"growth@{domain}",
        f"info@{domain}"
    ]

    for alt in fallbacks:
        if alt != failed_email.lower():
            return alt
    return None

def check_inbox_for_bounces_and_replies(app_password=None):
    """
    Connects to IMAP to detect hard bounces from mailer-daemon/postmaster
    and inbound replies from agency leads.
    """
    password = app_password or os.environ.get("OUTREACH_APP_PASSWORD")
    if not password:
        print("❌ Error: No Google Workspace App Password provided.")
        print("Set OUTREACH_APP_PASSWORD env var or pass --password.")
        return

    print(f"📡 Connecting to IMAP ({DEFAULT_CONFIG['imap_host']}) as {DEFAULT_CONFIG['sender_email']}...")
    try:
        mail = imaplib.IMAP4_SSL(DEFAULT_CONFIG["imap_host"], DEFAULT_CONFIG["imap_port"])
        mail.login(DEFAULT_CONFIG["sender_email"], password)
        mail.select("INBOX")
    except Exception as e:
        print(f"❌ IMAP connection failed: {e}")
        return

    status, messages = mail.search(None, "ALL")
    if status != "OK" or not messages[0]:
        print("📭 Inbox is empty or no messages found.")
        mail.logout()
        return

    email_ids = messages[0].split()
    print(f"🔍 Scanning last {min(len(email_ids), 50)} messages for bounces and replies...")

    conn = get_db()
    cursor = conn.cursor()

    # Get list of all contacted emails
    cursor.execute("SELECT id, email, agency_name, website FROM leads WHERE status IN ('TOUCH_1_SENT', 'TOUCH_2_SENT', 'TOUCH_3_SENT')")
    active_leads = {row["email"].lower(): row for row in cursor.fetchall()}

    bounces_found = 0
    replies_found = 0

    for eid in email_ids[-50:]:
        res, msg_data = mail.fetch(eid, "(RFC822)")
        if res != "OK":
            continue

        raw_email = msg_data[0][1]
        msg = BytesParser(policy=policy.default).parsebytes(raw_email)

        sender = str(msg.get("From", "")).lower()
        subject = str(msg.get("Subject", "")).lower()
        body_text = msg.get_body(preferencelist=('plain',)).get_content().lower() if msg.get_body() else ""

        # Check for bounce
        is_bounce = any(k in sender for k in ["mailer-daemon", "postmaster", "mail-noreply"]) or \
                    any(k in subject for k in ["failure", "undeliverable", "returned mail", "address not found"])

        if is_bounce:
            # Extract failed email from body
            for active_email, lead in active_leads.items():
                if active_email in body_text or active_email in subject:
                    print(f"\n⚠️  BOUNCE DETECTED for: {lead['agency_name']} <{active_email}>")
                    bounces_found += 1
                    
                    alt_email = derive_alternative_email(lead["agency_name"], lead["website"], active_email)
                    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                    if alt_email:
                        print(f"🔄 Discovered alternate fallback: {alt_email}. Queuing for re-outreach.")
                        cursor.execute("""
                        UPDATE leads SET 
                            status = 'RETRY_QUEUED',
                            bounced_at = ?,
                            bounce_reason = 'Mail delivery failure',
                            alternative_email = ?,
                            updated_at = ?
                        WHERE id = ?
                        """, (now_str, alt_email, now_str, lead["id"]))
                    else:
                        cursor.execute("""
                        UPDATE leads SET 
                            status = 'BOUNCED',
                            bounced_at = ?,
                            bounce_reason = 'Mail delivery failure',
                            updated_at = ?
                        WHERE id = ?
                        """, (now_str, now_str, lead["id"]))
                    conn.commit()
                    break

        # Check for reply from a lead
        for active_email, lead in active_leads.items():
            if active_email in sender:
                print(f"\n🔥 INBOUND REPLY from: {lead['agency_name']} ({active_email})!")
                print(f"Subject: {msg.get('Subject')}")
                print(f"Halting automated sequences for this lead.")
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute("""
                UPDATE leads SET 
                    status = 'REPLIED',
                    replied_at = ?,
                    updated_at = ?
                WHERE id = ?
                """, (now_str, now_str, lead["id"]))
                conn.commit()
                replies_found += 1
                break

    mail.logout()
    conn.close()
    print(f"\n✅ Scan complete. {bounces_found} bounces processed, {replies_found} replies detected.")

def send_outreach_batch(limit=10, instant=False, app_password=None):
    """
    Sends the next batch of emails, respecting daily limits and warmup pauses.
    """
    password = app_password or os.environ.get("OUTREACH_APP_PASSWORD")
    if not password:
        print("❌ Error: No Google Workspace App Password provided.")
        print("Please generate an App Password in your Google Account settings.")
        print("Run with: python outreach_engine.py send --password 'xxxx xxxx xxxx xxxx'")
        return

    sent_today = get_sent_today_count()
    daily_ceiling = DEFAULT_CONFIG["daily_limit_week1"]

    if sent_today >= daily_ceiling:
        print(f"🛑 Daily warmup safety limit reached ({sent_today}/{daily_ceiling} sent today).")
        print("Stopping sends to protect domain reputation and prevent blacklisting.")
        return

    allowed_sends = min(limit, daily_ceiling - sent_today)
    print(f"🚀 Preparing to send up to {allowed_sends} email(s) today ({sent_today} already sent)...")

    conn = get_db()
    cursor = conn.cursor()

    # Priority 1: Follow-ups due for Touch 2
    # Priority 2: Follow-ups due for Touch 3
    # Priority 3: New Touch 1 sends
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    SELECT * FROM leads 
    WHERE (status = 'PENDING') 
       OR (status = 'RETRY_QUEUED' AND alternative_email IS NOT NULL)
       OR (status = 'TOUCH_1_SENT' AND next_touch_due <= ?)
       OR (status = 'TOUCH_2_SENT' AND next_touch_due <= ?)
    ORDER BY 
        CASE 
            WHEN status = 'TOUCH_2_SENT' THEN 1
            WHEN status = 'TOUCH_1_SENT' THEN 2
            WHEN status = 'RETRY_QUEUED' THEN 3
            ELSE 4
        END, id ASC
    LIMIT ?
    """, (now_str, now_str, allowed_sends))

    queue = cursor.fetchall()

    if not queue:
        print("✅ No emails currently due for sending.")
        conn.close()
        return

    # Test credentials before starting loop
    try:
        test_srv = smtplib.SMTP(DEFAULT_CONFIG["smtp_host"], DEFAULT_CONFIG["smtp_port"])
        test_srv.starttls()
        test_srv.login(DEFAULT_CONFIG["sender_email"], password)
        test_srv.quit()
        print("✅ Verified Google Workspace SMTP authentication.")
    except Exception as e:
        print(f"❌ SMTP login failed: {e}")
        conn.close()
        return

    for i, lead in enumerate(queue, 1):
        target_email = lead["alternative_email"] if lead["status"] == "RETRY_QUEUED" else lead["email"]
        vars = format_lead_variables(lead)

        stage = 1
        if lead["status"] == "TOUCH_1_SENT":
            stage = 2
        elif lead["status"] == "TOUCH_2_SENT":
            stage = 3

        subject, text_body = render_template(stage, vars, "txt")
        _, html_body = render_template(stage, vars, "html")

        # Construct MIME Message
        msg = MIMEMultipart("alternative")
        msg["From"] = f"{DEFAULT_CONFIG['sender_name']} <{DEFAULT_CONFIG['sender_email']}>"
        msg["To"] = f"{vars['contact_name']} <{target_email}>"
        msg["Subject"] = subject
        msg["Reply-To"] = DEFAULT_CONFIG["sender_email"]

        msg.attach(MIMEText(text_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        print(f"\n📤 [{i}/{len(queue)}] Sending Touch {stage} to {lead['agency_name']} <{target_email}>...")

        try:
            server = smtplib.SMTP(DEFAULT_CONFIG["smtp_host"], DEFAULT_CONFIG["smtp_port"])
            server.starttls()
            server.login(DEFAULT_CONFIG["sender_email"], password)
            server.sendmail(DEFAULT_CONFIG["sender_email"], target_email, msg.as_string())
            server.quit()
            print(f"   ✅ Successfully delivered to {target_email}!")

            # Calculate next due date
            now = datetime.now()
            next_status = f"TOUCH_{stage}_SENT"
            next_due = None
            if stage == 1:
                next_due = (now + timedelta(days=DEFAULT_CONFIG["touch_2_delay_days"])).strftime("%Y-%m-%d %H:%M:%S")
            elif stage == 2:
                next_due = (now + timedelta(days=DEFAULT_CONFIG["touch_3_delay_days"])).strftime("%Y-%m-%d %H:%M:%S")
            else:
                next_status = "COMPLETED"

            cursor.execute(f"""
            UPDATE leads SET 
                status = ?,
                touch_{stage}_sent_at = ?,
                next_touch_due = ?,
                updated_at = ?
            WHERE id = ?
            """, (next_status, now.strftime("%Y-%m-%d %H:%M:%S"), next_due, now.strftime("%Y-%m-%d %H:%M:%S"), lead["id"]))

            cursor.execute("""
            INSERT INTO send_logs (lead_id, email, touch_stage, subject, status)
            VALUES (?, ?, ?, ?, 'SUCCESS')
            """, (lead["id"], target_email, stage, subject))
            conn.commit()

        except Exception as e:
            print(f"   ❌ Delivery error: {e}")
            cursor.execute("""
            INSERT INTO send_logs (lead_id, email, touch_stage, subject, status, error_message)
            VALUES (?, ?, ?, ?, 'FAILED', ?)
            """, (lead["id"], target_email, stage, subject, str(e)))
            conn.commit()

        # Enforce deliverability sleep between emails
        if i < len(queue) and not instant:
            sleep_time = random.randint(12, 25)
            print(f"⏳ Pacing {sleep_time}s before next send...")
            time.sleep(sleep_time)

    conn.close()
    print("\n🎉 Batch sending finished.")

def send_test_email(recipient, app_password=None):
    """Sends a sample Touch 1 email to the specified recipient to preview live formatting."""
    password = app_password or os.environ.get("OUTREACH_APP_PASSWORD")
    if not password:
        print("❌ Error: No Google Workspace App Password provided.")
        return

    sample_lead = {
        "contact_name": "Dale Johnson",
        "agency_name": "Sample DTC Partner Agency",
        "website": "https://sampleagency.com",
        "specialization": "Shopify Plus & Paid Meta Scaling",
        "client_stores": "35+"
    }
    vars = format_lead_variables(sample_lead)
    subject, text_body = render_template(1, vars, "txt")
    _, html_body = render_template(1, vars, "html")

    msg = MIMEMultipart("alternative")
    msg["From"] = f"{DEFAULT_CONFIG['sender_name']} <{DEFAULT_CONFIG['sender_email']}>"
    msg["To"] = f"Dale Johnson <{recipient}>"
    msg["Subject"] = f"[LIVE PREVIEW] {subject}"
    msg["Reply-To"] = DEFAULT_CONFIG["sender_email"]

    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    print(f"📤 Sending test outreach email to {recipient} via Google Workspace SMTP...")
    try:
        server = smtplib.SMTP(DEFAULT_CONFIG["smtp_host"], DEFAULT_CONFIG["smtp_port"])
        server.starttls()
        server.login(DEFAULT_CONFIG["sender_email"], password)
        server.sendmail(DEFAULT_CONFIG["sender_email"], recipient, msg.as_string())
        server.quit()
        print(f"✅ Test email successfully delivered to {recipient}!")
        print("Check your Gmail inbox at mail.google.com to inspect formatting and links.")
    except Exception as e:
        print(f"❌ Test send failed: {e}")

def main():
    parser = argparse.ArgumentParser(description="404 Killer App Autonomous Outreach Engine")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("init", help="Initialize SQLite CRM from agency CSV")
    subparsers.add_parser("status", help="Show current campaign status and metrics")
    
    dry_parser = subparsers.add_parser("dry-run", help="Preview next emails without sending")
    dry_parser.add_argument("--limit", type=int, default=3, help="Number of previews to display")

    test_parser = subparsers.add_parser("test", help="Send a test email to preview layout")
    test_parser.add_argument("--to", type=str, default="djohnson@404killer.com", help="Recipient email")
    test_parser.add_argument("--password", type=str, default="", help="Google Workspace App Password")

    send_parser = subparsers.add_parser("send", help="Send the next batch of emails")
    send_parser.add_argument("--limit", type=int, default=10, help="Max emails to send in this batch")
    send_parser.add_argument("--instant", action="store_true", help="Skip pacing delays (for testing only)")
    send_parser.add_argument("--password", type=str, default="", help="Google Workspace App Password")

    inbox_parser = subparsers.add_parser("check-inbox", help="Scan inbox for bounce-backs and replies")
    inbox_parser.add_argument("--password", type=str, default="", help="Google Workspace App Password")

    args = parser.parse_args()

    if args.command == "init":
        init_db()
    elif args.command == "status":
        show_status()
    elif args.command == "dry-run":
        dry_run(args.limit)
    elif args.command == "test":
        send_test_email(args.to, args.password)
    elif args.command == "send":
        send_outreach_batch(args.limit, args.instant, args.password)
    elif args.command == "check-inbox":
        check_inbox_for_bounces_and_replies(args.password)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()

