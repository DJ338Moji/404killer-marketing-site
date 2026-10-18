#!/usr/bin/env python3
"""
404 Killer App (DevRevIQ LLC) — ABM Custom Audience Exporter
============================================================
Exports curated agency leads from outreach_crm.sqlite into platform-specific
custom audience CSV formats for micro-budget ($3–$5/day) retargeting:
1. Meta Ads Manager Custom Audience (email, fn, ln, country, company)
2. LinkedIn Matched Audiences (companyname, companywebsite, companydomain)
3. Master ABM Agency Target List (complete telemetry)

STRICT CONSTRAINT: Zero street address in any file.
"""

import os
import sqlite3
import csv
import re
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SITE_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
DB_PATH = os.path.join(SITE_ROOT, "outreach", "outreach_crm.sqlite")
AUDIENCE_DIR = BASE_DIR
os.makedirs(AUDIENCE_DIR, exist_ok=True)

def extract_domain(url):
    if not url:
        return ""
    if not url.startswith("http"):
        url = "https://" + url
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    if domain.startswith("www."):
        domain = domain[4:]
    return domain

def split_name(full_name):
    if not full_name:
        return "", ""
    parts = full_name.strip().split()
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])

def export_audiences():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database not found at {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        SELECT id, agency_name, website, contact_name, role, email, phone, location, specialization, client_stores, status
        FROM leads
        ORDER BY id ASC
    """)
    rows = cur.fetchall()
    conn.close()

    print(f"Loaded {len(rows)} leads from CRM database.")

    # 1. Meta Ads Custom Audience List
    meta_path = os.path.join(AUDIENCE_DIR, "meta_custom_audience_agencies.csv")
    with open(meta_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["email", "fn", "ln", "country", "company"])
        for r in rows:
            agency_name = r[1]
            contact_name = r[3]
            email = r[5].strip().lower() if r[5] else ""
            fn, ln = split_name(contact_name)
            writer.writerow([email, fn, ln, "US", agency_name])
    print(f"✅ Exported Meta Custom Audience: {meta_path} ({len(rows)} records)")

    # 2. LinkedIn Company Matched Audience List
    linkedin_path = os.path.join(AUDIENCE_DIR, "linkedin_matched_audience_agencies.csv")
    # LinkedIn accepts company list: companyname, companywebsite, companydomain
    seen_companies = set()
    with open(linkedin_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["companyname", "companywebsite", "companydomain"])
        for r in rows:
            agency_name = r[1].strip()
            website = r[2].strip() if r[2] else ""
            domain = extract_domain(website)
            if agency_name.lower() not in seen_companies:
                seen_companies.add(agency_name.lower())
                writer.writerow([agency_name, website, domain])
    print(f"✅ Exported LinkedIn Matched Audience: {linkedin_path} ({len(seen_companies)} unique agencies)")

    # 3. Master ABM Agency Dossier
    master_path = os.path.join(AUDIENCE_DIR, "master_abm_agencies_target_list.csv")
    with open(master_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id", "agency_name", "website", "domain", "contact_name", 
            "role", "email", "phone", "location", "specialization", 
            "client_stores", "crm_status"
        ])
        for r in rows:
            domain = extract_domain(r[2])
            writer.writerow([
                r[0], r[1], r[2], domain, r[3], 
                r[4], r[5], r[6], r[7], r[8], 
                r[9], r[10]
            ])
    print(f"✅ Exported Master ABM Dossier: {master_path} ({len(rows)} records)")

if __name__ == "__main__":
    export_audiences()
