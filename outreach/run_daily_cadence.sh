#!/usr/bin/env bash
# 404 Killer App: Daily Outreach Cadence Runner
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "=================================================="
echo "🛡️  404 KILLER APP: AGENCY OUTREACH RUNNER"
echo "=================================================="

# Check inbox for bounces & replies first
echo "🔍 Checking inbox for bounce-backs and replies..."
python3 outreach_engine.py check-inbox "$@"

echo ""
echo "📊 Current Campaign Status:"
python3 outreach_engine.py status

echo ""
echo "🚀 Sending today's scheduled batch..."
python3 outreach_engine.py send "$@"

echo ""
echo "📊 Updated Campaign Status:"
python3 outreach_engine.py status
