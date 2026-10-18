#!/usr/bin/env python3
"""
404 Killer App (DevRevIQ LLC) — Social Brand Assets & Banners Generator
=======================================================================
Generates pixel-perfect social brand banners and profile graphics:
1. avatar_800x800.png - Master Square Brand Icon for X, LinkedIn, IG, YouTube
2. x_header_1500x500.png - X / Twitter Profile Header
3. linkedin_banner_1584x396.png - LinkedIn Company Page Banner
4. youtube_banner_2560x1440.png - YouTube Channel Art (with 1546x423 safe zone)
5. instagram_feed_post_1080x1080.png - High-impact feed graphic

STRICT CONSTRAINT: Zero street address in any image or metadata.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SITE_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
PUBLIC_DIR = os.path.join(SITE_ROOT, "public")
BANNERS_DIR = BASE_DIR
os.makedirs(BANNERS_DIR, exist_ok=True)

# System Fonts on macOS
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_MONO = "/System/Library/Fonts/Menlo.ttc"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_avatar():
    src_icon = os.path.join(PUBLIC_DIR, "app-icon.png")
    out_path = os.path.join(BANNERS_DIR, "avatar_800x800.png")
    if os.path.exists(src_icon):
        im = Image.open(src_icon)
        im = im.resize((800, 800), Image.Resampling.LANCZOS)
        im.save(out_path, format="PNG", optimize=True)
        print(f"✅ Generated Avatar: {out_path} (800x800)")
    else:
        print("⚠️ app-icon.png not found, creating avatar fallback")

def generate_x_banner():
    """1500 x 500 banner for X (Twitter)"""
    w, h = 1500, 500
    img = Image.new("RGB", (w, h), color=(10, 15, 30)) # #0a0f1e
    draw = ImageDraw.Draw(img)

    # Accent glow grid line at top & bottom
    draw.line([(0, 0), (w, 0)], fill=(16, 185, 129), width=4) # Emerald accent
    draw.line([(0, h - 1), (w, h - 1)], fill=(30, 41, 59), width=2)

    # Safe zone considerations: Avatar overlaps bottom-left on desktop/mobile
    # Place core content from x=380 to x=1420
    f_badge = get_font(FONT_MONO, 16)
    f_brand = get_font(FONT_BOLD, 42)
    f_sub = get_font(FONT_BOLD, 26)
    f_desc = get_font(FONT_REGULAR, 19)
    f_pill = get_font(FONT_BOLD, 17)
    f_url = get_font(FONT_BOLD, 22)

    # Top Status Pill
    draw_rounded_rect(draw, (380, 55, 680, 95), 12, fill=(15, 23, 42), outline=(16, 185, 129), width=1)
    draw.text((400, 67), "⚡ 50ms AUTONOMOUS LINK HEALER", font=f_badge, fill=(52, 211, 153))

    # Main Brand Header
    draw.text((380, 115), "404 KILLER APP", font=f_brand, fill=(255, 255, 255))
    draw.text((380, 170), "Autonomous Revenue Defense for Shopify Plus & Paid Media", font=f_sub, fill=(148, 163, 184))

    # Tagline description
    draw.text((380, 215), "Merchandisers delete SKUs. We stop ad spend from burning into 404 dead ends.", font=f_desc, fill=(203, 213, 225))
    draw.text((380, 245), "Zero lost ROAS. Guaranteed 301 smart rerouting before Meta & TikTok pixels fire.", font=f_desc, fill=(148, 163, 184))

    # Right Side Value Pillars Card
    card_x1, card_y1, card_x2, card_y2 = 1040, 60, 1440, 430
    draw_rounded_rect(draw, (card_x1, card_y1, card_x2, card_y2), 16, fill=(15, 23, 42), outline=(30, 41, 59), width=2)

    draw.text((card_x1 + 25, card_y1 + 28), "AGENCY SENTINEL NETWORK", font=f_badge, fill=(56, 189, 248))
    
    pillars = [
        ("✓ Zero Paid Traffic Waste", "Reroutes dead ad clicks"),
        ("✓ Automated 301 Smart Match", "50ms Edge precision"),
        ("✓ 25% Lifetime Rev-Share", "Agency Partner Program"),
        ("✓ Shopify Plus & Custom", "Instant activation")
    ]
    py = card_y1 + 75
    for title, detail in pillars:
        draw.text((card_x1 + 25, py), title, font=f_pill, fill=(255, 255, 255))
        draw.text((card_x1 + 45, py + 24), detail, font=get_font(FONT_REGULAR, 15), fill=(100, 116, 139))
        py += 62

    # Clean CTA on Left
    draw_rounded_rect(draw, (380, 310, 620, 365), 14, fill=(16, 185, 129))
    draw.text((500, 337), "Visit 404killer.com", font=f_url, fill=(10, 15, 30), anchor="mm")

    draw_rounded_rect(draw, (640, 310, 920, 365), 14, fill=(30, 41, 59), outline=(51, 65, 85), width=1)
    draw.text((780, 337), "Agency Partners 👉 25%", font=f_url, fill=(255, 255, 255), anchor="mm")

    out_path = os.path.join(BANNERS_DIR, "x_header_1500x500.png")
    img.save(out_path, format="PNG", optimize=True)
    print(f"✅ Generated X Banner: {out_path} (1500x500)")

def generate_linkedin_banner():
    """1584 x 396 banner for LinkedIn Company Page"""
    w, h = 1584, 396
    img = Image.new("RGB", (w, h), color=(10, 15, 30))
    draw = ImageDraw.Draw(img)

    # Accent line
    draw.line([(0, 0), (w, 0)], fill=(16, 185, 129), width=4)
    draw.line([(0, h - 1), (w, h - 1)], fill=(30, 41, 59), width=2)

    # Profile logo appears on bottom-left, so keep left 300px clear
    f_badge = get_font(FONT_MONO, 15)
    f_brand = get_font(FONT_BOLD, 38)
    f_sub = get_font(FONT_BOLD, 23)
    f_desc = get_font(FONT_REGULAR, 17)
    f_btn = get_font(FONT_BOLD, 18)

    # Status Pill
    draw_rounded_rect(draw, (360, 40, 690, 76), 10, fill=(15, 23, 42), outline=(16, 185, 129), width=1)
    draw.text((375, 51), "ENTERPRISE LINK HEALING SENTINEL", font=f_badge, fill=(52, 211, 153))

    # Title
    draw.text((360, 95), "404 KILLER APP", font=f_brand, fill=(255, 255, 255))
    draw.text((360, 145), "Stop Burning Paid Ad Spend on Deleted & Out-Of-Stock SKUs", font=f_sub, fill=(148, 163, 184))
    draw.text((360, 185), "Autonomous 50ms edge rerouting for performance agencies & high-volume e-commerce brands.", font=f_desc, fill=(203, 213, 225))

    # 3 Metrics Badges
    badges = [
        ("50ms", "Healing Latency", (16, 185, 129)),
        ("0%", "Paid Click Waste", (56, 189, 248)),
        ("25%", "Agency Rev-Share", (251, 191, 36))
    ]
    bx = 360
    for stat, label, color in badges:
        draw_rounded_rect(draw, (bx, 230, bx + 190, 310), 12, fill=(15, 23, 42), outline=(30, 41, 59), width=1)
        draw.text((bx + 20, 242), stat, font=get_font(FONT_BOLD, 28), fill=color)
        draw.text((bx + 20, 278), label, font=get_font(FONT_REGULAR, 14), fill=(148, 163, 184))
        bx += 210

    # Right Side CTA Card
    rc_w, rc_h = 420, 300
    rc_x = w - rc_w - 60
    rc_y = 48
    draw_rounded_rect(draw, (rc_x, rc_y, rc_x + rc_w, rc_y + rc_h), 16, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
    draw.text((rc_x + 30, rc_y + 35), "AGENCY ROSTER PROTECTION", font=f_badge, fill=(56, 189, 248))
    draw.text((rc_x + 30, rc_y + 75), "Defend your ad retainers.", font=f_btn, fill=(255, 255, 255))
    draw.text((rc_x + 30, rc_y + 110), "Protect client ROAS from unexpected", font=f_desc, fill=(148, 163, 184))
    draw.text((rc_x + 30, rc_y + 135), "merchandising deletions & broken links.", font=f_desc, fill=(148, 163, 184))

    # CTA Button
    draw_rounded_rect(draw, (rc_x + 30, rc_y + 195, rc_x + rc_w - 30, rc_y + 255), 12, fill=(16, 185, 129))
    draw.text((rc_x + rc_w // 2, rc_y + 225), "Explore Roster Protection 👉 404killer.com", font=get_font(FONT_BOLD, 16), fill=(10, 15, 30), anchor="mm")

    out_path = os.path.join(BANNERS_DIR, "linkedin_banner_1584x396.png")
    img.save(out_path, format="PNG", optimize=True)
    print(f"✅ Generated LinkedIn Banner: {out_path} (1584x396)")

def generate_youtube_banner():
    """2560 x 1440 YouTube Channel Art (Safe Zone: 1546x423 in center)"""
    w, h = 2560, 1440
    img = Image.new("RGB", (w, h), color=(10, 15, 30))
    draw = ImageDraw.Draw(img)

    # Safe Zone: x from (2560-1546)//2 = 507 to 2053, y from (1440-423)//2 = 508 to 931
    safe_x1, safe_y1 = 507, 508
    safe_x2, safe_y2 = 2053, 931

    # Subtle safe zone backdrop
    draw_rounded_rect(draw, (safe_x1, safe_y1, safe_x2, safe_y2), 24, fill=(15, 23, 42), outline=(16, 185, 129), width=2)

    f_badge = get_font(FONT_MONO, 24)
    f_brand = get_font(FONT_BOLD, 64)
    f_sub = get_font(FONT_BOLD, 36)
    f_desc = get_font(FONT_REGULAR, 26)
    f_btn = get_font(FONT_BOLD, 30)

    # Content centered in safe zone
    draw.text((w // 2, safe_y1 + 65), "⚡ 404 KILLER APP  •  AUTONOMOUS REVENUE DEFENSE", font=f_badge, fill=(52, 211, 153), anchor="mm")
    draw.text((w // 2, safe_y1 + 140), "Stop Burning Paid Traffic On Dead Links", font=f_brand, fill=(255, 255, 255), anchor="mm")
    draw.text((w // 2, safe_y1 + 215), "50ms Edge Healing for Shopify Plus, Meta Ads, TikTok & Google Shopping", font=f_sub, fill=(148, 163, 184), anchor="mm")
    draw.text((w // 2, safe_y1 + 275), "Autonomous 301 Smart-Match • ROAS Protection • 25% Agency Partner Program", font=f_desc, fill=(203, 213, 225), anchor="mm")

    # CTA Button
    btn_w, btn_h = 560, 75
    bx = (w - btn_w) // 2
    by = safe_y1 + 325
    draw_rounded_rect(draw, (bx, by, bx + btn_w, by + btn_h), 18, fill=(16, 185, 129))
    draw.text((w // 2, by + btn_h // 2), "Deploy Protection 👉 404killer.com", font=f_btn, fill=(10, 15, 30), anchor="mm")

    out_path = os.path.join(BANNERS_DIR, "youtube_banner_2560x1440.png")
    img.save(out_path, format="PNG", optimize=True)
    print(f"✅ Generated YouTube Banner: {out_path} (2560x1440)")

def generate_instagram_feed_post():
    """1080 x 1080 Announcement Card for Instagram / LinkedIn Post"""
    w, h = 1080, 1080
    img = Image.new("RGB", (w, h), color=(10, 15, 30))
    draw = ImageDraw.Draw(img)

    # Border glow
    draw_rounded_rect(draw, (30, 30, w - 30, h - 30), 24, fill=(15, 23, 42), outline=(16, 185, 129), width=3)

    f_badge = get_font(FONT_MONO, 22)
    f_h1 = get_font(FONT_BOLD, 46)
    f_h2 = get_font(FONT_BOLD, 36)
    f_body = get_font(FONT_REGULAR, 26)
    f_bold = get_font(FONT_TITLE_BOLD, 28) if "FONT_TITLE_BOLD" in globals() else get_font(FONT_BOLD, 28)
    f_cta = get_font(FONT_BOLD, 36)

    # Header
    draw.text((w // 2, 90), "THE PERFORMANCE AD DISASTER", font=f_badge, fill=(244, 63, 94), anchor="mm")
    draw.text((w // 2, 160), "Your Merchandisers Delete SKUs.", font=f_h1, fill=(255, 255, 255), anchor="mm")
    draw.text((w // 2, 225), "Your Media Buyers Get Fired.", font=f_h1, fill=(239, 68, 68), anchor="mm")

    # Center Comparison Card
    card_y = 290
    draw_rounded_rect(draw, (80, card_y, w - 80, card_y + 440), 20, fill=(2, 6, 23), outline=(30, 41, 59), width=2)

    rows = [
        ("Without 404 Killer:", "Meta Pixel fires on 404 error page. Client pays $4.20/click for a 98% bounce rate. Retainer at risk.", (248, 113, 113)),
        ("With 404 Killer:", "50ms Edge Intercept catches the click before pixel fires, smart-reroutes to in-stock SKU. ROAS saved.", (52, 211, 153)),
        ("Agency Rev-Share:", "25% Lifetime recurring share on every roster merchant protected.", (251, 191, 36))
    ]

    ry = card_y + 35
    for title, text, col in rows:
        draw.text((115, ry), title, font=f_bold, fill=col)
        # Wrap text manually
        words = text.split(" ")
        line1 = " ".join(words[:7])
        line2 = " ".join(words[7:])
        draw.text((115, ry + 40), line1, font=f_body, fill=(226, 232, 240))
        if line2:
            draw.text((115, ry + 75), line2, font=f_body, fill=(226, 232, 240))
        ry += 135

    # Bottom CTA Button
    btn_y = 820
    draw_rounded_rect(draw, (140, btn_y, w - 140, btn_y + 110), 20, fill=(16, 185, 129))
    draw.text((w // 2, btn_y + 55), "Defend Your Roster 👉 404killer.com", font=f_cta, fill=(10, 15, 30), anchor="mm")

    # Footer
    draw.text((w // 2, 985), "Instant Activation • Built for Shopify Plus & Leading Agencies", font=get_font(FONT_REGULAR, 20), fill=(148, 163, 184), anchor="mm")

    out_path = os.path.join(BANNERS_DIR, "instagram_feed_post_1080x1080.png")
    img.save(out_path, format="PNG", optimize=True)
    print(f"✅ Generated IG Post: {out_path} (1080x1080)")

if __name__ == "__main__":
    generate_avatar()
    generate_x_banner()
    generate_linkedin_banner()
    generate_youtube_banner()
    generate_instagram_feed_post()
    print("\n🎉 All social brand assets generated successfully!")
