#!/usr/bin/env python3
"""
404 Killer App (DevRevIQ LLC) — High-Impact 7-Second Forensic Video Generator
=============================================================================
Generates professional motion graphics assets for TikTok, Instagram Reels,
YouTube Shorts, LinkedIn, X, and Email outreach:
1. Vertical (1080x1920) MP4 — TikTok / Reels / Shorts
2. Square (1080x1080) MP4 — LinkedIn / X / Instagram Feeds
3. Email GIF (600x600) — Animated GIF for Cold Email Touch 2
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEOS_DIR = os.path.join(BASE_DIR, "videos")
BANNERS_DIR = os.path.join(BASE_DIR, "banners")
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(BANNERS_DIR, exist_ok=True)

# Fonts
FONT_TITLE_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_MONO = "/System/Library/Fonts/Menlo.ttc"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def render_frame(t, total_time, width, height):
    """
    Renders a single frame at timestamp t (0.0 to total_time).
    Three distinct narrative acts:
    Act 1 (0.0s - 2.5s): Meta Ads Manager — $14,850 Spend, $4.20 CPC.
    Act 2 (2.5s - 5.0s): Click Ad ➔ 404 Error Page ➔ Meta Pixel Fires PageView ($4.20 billed).
    Act 3 (5.0s - 7.5s): 404 Killer App Activates ➔ 50ms Autonomous Intercept ➔ ROAS Protected.
    """
    img = Image.new("RGB", (width, height), color=(10, 15, 30))
    draw = ImageDraw.Draw(img)

    scale = width / 1080.0

    # Fonts scaled
    f_h1 = get_font(FONT_TITLE_BOLD, int(46 * scale))
    f_h2 = get_font(FONT_TITLE_BOLD, int(34 * scale))
    f_body = get_font(FONT_REGULAR, int(26 * scale))
    f_bold = get_font(FONT_TITLE_BOLD, int(26 * scale))
    f_small = get_font(FONT_REGULAR, int(20 * scale))
    f_mono = get_font(FONT_MONO, int(22 * scale))
    f_cta = get_font(FONT_TITLE_BOLD, int(36 * scale))

    # Background subtle grid glow
    center_y = height / 2.0
    progress = t / total_time

    if t < 2.5:
        # ==========================================
        # ACT 1: THE SPEND (Meta Ads Manager)
        # ==========================================
        # Top Header Hook
        draw.text((width // 2, int(120 * scale)), "YOUR CLIENT SPENT $14,850", font=f_h1, fill=(244, 63, 94), anchor="mm")
        draw.text((width // 2, int(185 * scale)), "ON META ADS THIS WEEK...", font=f_h2, fill=(255, 255, 255), anchor="mm")

        # Mock Ads Manager Card
        card_w, card_h = int(920 * scale), int(640 * scale)
        cx = (width - card_w) // 2
        cy = int(270 * scale) if height > 1500 else int(230 * scale)

        draw_rounded_rect(draw, (cx, cy, cx + card_w, cy + card_h), int(24 * scale), fill=(15, 23, 42), outline=(30, 41, 59), width=2)

        # Meta Ads Header Bar
        draw.text((cx + int(36 * scale), cy + int(40 * scale)), "Meta Ads Manager  •  Active Campaign", font=f_mono, fill=(59, 130, 246))
        draw.text((cx + int(36 * scale), cy + int(90 * scale)), "Black Friday Scale — Retargeting & Lookalikes", font=f_bold, fill=(255, 255, 255))

        # Metrics Row
        m_y = cy + int(160 * scale)
        metrics = [
            ("Amount Spent", "$14,850.00", (244, 63, 94)),
            ("Cost Per Click", "$4.20", (251, 191, 36)),
            ("Link Clicks", "3,535", (255, 255, 255)),
            ("Reported ROAS", "2.14x", (16, 185, 129))
        ]
        col_w = card_w // 4
        for i, (label, val, val_col) in enumerate(metrics):
            mx = cx + i * col_w + int(20 * scale)
            draw.text((mx, m_y), label, font=f_small, fill=(148, 163, 184))
            draw.text((mx, m_y + int(36 * scale)), val, font=f_bold, fill=val_col)

        # Ad Creative Mock Preview
        ad_y = cy + int(280 * scale)
        draw_rounded_rect(draw, (cx + int(36 * scale), ad_y, cx + card_w - int(36 * scale), ad_y + int(300 * scale)), int(16 * scale), fill=(30, 41, 59))
        draw.text((cx + int(60 * scale), ad_y + int(30 * scale)), "Sponsored • Shopify Plus Store", font=f_small, fill=(148, 163, 184))
        draw.text((cx + int(60 * scale), ad_y + int(70 * scale)), "🔥 Limited Q4 Restock: 40% Off Winter Collection", font=f_bold, fill=(255, 255, 255))
        draw.text((cx + int(60 * scale), ad_y + int(115 * scale)), "Destination: store.com/collections/winter-sale?utm_source=meta", font=f_mono, fill=(56, 189, 248))

        # CTA Button
        draw_rounded_rect(draw, (cx + int(60 * scale), ad_y + int(180 * scale), cx + int(320 * scale), ad_y + int(250 * scale)), int(12 * scale), fill=(59, 130, 246))
        draw.text((cx + int(190 * scale), ad_y + int(215 * scale)), "Shop Now 👉", font=f_bold, fill=(255, 255, 255), anchor="mm")

        # Bottom Sub-hook
        sub_y = int(1050 * scale) if height > 1500 else int(910 * scale)
        draw.text((width // 2, sub_y), "Watch what happens when shoppers click...", font=f_body, fill=(148, 163, 184), anchor="mm")

    elif t < 5.0:
        # ==========================================
        # ACT 2: THE 404 CRASH & THE PIXEL LIE
        # ==========================================
        draw.text((width // 2, int(120 * scale)), "PAID TRAFFIC SMASHED INTO A 404", font=f_h1, fill=(239, 68, 68), anchor="mm")
        draw.text((width // 2, int(185 * scale)), "AND META STILL BILLED FOR THE CLICK!", font=f_h2, fill=(251, 191, 36), anchor="mm")

        # Mock Browser Screen
        card_w, card_h = int(920 * scale), int(680 * scale)
        cx = (width - card_w) // 2
        cy = int(260 * scale) if height > 1500 else int(220 * scale)

        draw_rounded_rect(draw, (cx, cy, cx + card_w, cy + card_h), int(24 * scale), fill=(15, 23, 42), outline=(239, 68, 68), width=3)

        # URL Bar
        draw_rounded_rect(draw, (cx + int(30 * scale), cy + int(25 * scale), cx + card_w - int(30 * scale), cy + int(85 * scale)), int(12 * scale), fill=(30, 41, 59))
        draw.text((cx + int(50 * scale), cy + int(55 * scale)), "🔒 store.com/collections/winter-sale  ➔  HTTP 404", font=f_mono, fill=(244, 63, 94), anchor="lm")

        # 404 Content
        draw.text((width // 2, cy + int(180 * scale)), "404", font=get_font(FONT_TITLE_BOLD, int(90 * scale)), fill=(239, 68, 68), anchor="mm")
        draw.text((width // 2, cy + int(260 * scale)), "Page Not Found", font=f_h2, fill=(255, 255, 255), anchor="mm")
        draw.text((width // 2, cy + int(310 * scale)), "The collection you are looking for has been moved or deleted.", font=f_body, fill=(148, 163, 184), anchor="mm")

        # The Pixel Helper Popover
        pix_w, pix_h = int(760 * scale), int(220 * scale)
        px = (width - pix_w) // 2
        py = cy + int(390 * scale)
        draw_rounded_rect(draw, (px, py, px + pix_w, py + pix_h), int(16 * scale), fill=(2, 6, 23), outline=(16, 185, 129), width=3)

        draw.text((px + int(30 * scale), py + int(40 * scale)), "Meta Pixel Helper — Active on Page", font=f_small, fill=(148, 163, 184))
        draw.text((px + int(30 * scale), py + int(90 * scale)), "✓ PageView Event: SUCCESS", font=f_bold, fill=(16, 185, 129))
        draw.text((px + int(30 * scale), py + int(135 * scale)), "Billed To Merchant: $4.20 per click (94% bounce rate)", font=f_body, fill=(255, 255, 255))
        draw.text((px + int(30 * scale), py + int(175 * scale)), "Status: Client blames media buyer for bad ROAS", font=f_mono, fill=(251, 191, 36))

        # Bottom Warning
        sub_y = int(1050 * scale) if height > 1500 else int(930 * scale)
        draw.text((width // 2, sub_y), "Merchandisers delete SKUs. Media buyers get fired.", font=f_body, fill=(248, 113, 113), anchor="mm")

    else:
        # ==========================================
        # ACT 3: THE SOLUTION (404 Killer App)
        # ==========================================
        pulse_color = (16, 185, 129)
        draw.text((width // 2, int(120 * scale)), "404 KILLER APP: REVENUE SHIELD", font=f_h1, fill=pulse_color, anchor="mm")
        draw.text((width // 2, int(185 * scale)), "50ms AUTONOMOUS LINK HEALER", font=f_h2, fill=(255, 255, 255), anchor="mm")

        # Solution Card
        card_w, card_h = int(920 * scale), int(640 * scale)
        cx = (width - card_w) // 2
        cy = int(260 * scale) if height > 1500 else int(220 * scale)

        draw_rounded_rect(draw, (cx, cy, cx + card_w, cy + card_h), int(24 * scale), fill=(15, 23, 42), outline=pulse_color, width=3)

        features = [
            ("⚡ 50ms Edge Sentinel", "Intercepts 404s before Meta/TikTok pixel fires"),
            ("🛡️ Autonomous 301 Smart-Match", "Reroutes dead ad clicks to matching in-stock SKUs"),
            ("📈 ROAS & Retainer Defense", "Zero burned clicks • Client retention guaranteed"),
            ("💰 25% Lifetime Rev-Share", "Compounding recurring partner revenue for agencies")
        ]

        fy = cy + int(60 * scale)
        for icon_title, desc in features:
            draw.text((cx + int(45 * scale), fy), icon_title, font=f_bold, fill=(52, 211, 153))
            draw.text((cx + int(45 * scale), fy + int(42 * scale)), desc, font=f_body, fill=(226, 232, 240))
            fy += int(110 * scale)

        # Big CTA
        cta_y = cy + int(480 * scale)
        cta_w = int(720 * scale)
        cta_x = (width - cta_w) // 2
        draw_rounded_rect(draw, (cta_x, cta_y, cta_x + cta_w, cta_y + int(100 * scale)), int(18 * scale), fill=pulse_color)
        draw.text((width // 2, cta_y + int(50 * scale)), "Protect Your Roster 👉 404killer.com", font=f_cta, fill=(10, 15, 30), anchor="mm")

        # Bottom Tagline
        sub_y = int(1050 * scale) if height > 1500 else int(930 * scale)
        draw.text((width // 2, sub_y), "Instant Activation • Trusted by Top Performance Agencies", font=f_body, fill=(148, 163, 184), anchor="mm")

    return np.array(img)

def render_video(output_path, width, height, fps=24, duration=7.5):
    total_frames = int(fps * duration)
    print(f"🎬 Rendering {output_path} ({width}x{height}, {fps} fps, {duration}s, {total_frames} frames)...")

    writer = imageio.get_writer(
        output_path,
        fps=fps,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=None
    )

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        frame = render_frame(t, duration, width, height)
        writer.append_data(frame)
        if frame_idx % 24 == 0:
            print(f"  Frame {frame_idx}/{total_frames} ({t:.1f}s)...")

    writer.close()
    print(f"✅ Video render complete: {output_path} ({os.path.getsize(output_path) / 1024:.1f} KB)\n")

def render_gif(output_path, width=600, height=600, fps=10, duration=7.5):
    total_frames = int(fps * duration)
    print(f"🖼️ Rendering Email GIF {output_path} ({width}x{height}, {fps} fps)...")
    frames = []

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        frame_arr = render_frame(t, duration, width, height)
        img = Image.fromarray(frame_arr).quantize(colors=128, method=Image.Quantize.MEDIANCUT)
        frames.append(img)

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=int(1000 / fps),
        loop=0,
        optimize=True
    )
    print(f"✅ Email GIF render complete: {output_path} ({os.path.getsize(output_path) / 1024:.1f} KB)\n")

if __name__ == "__main__":
    # 1. Vertical 1080x1920 (TikTok, Reels, Shorts)
    v_path = os.path.join(VIDEOS_DIR, "404killer_ad_bleed_vertical.mp4")
    render_video(v_path, width=1080, height=1920, fps=24, duration=7.5)

    # 2. Square 1080x1080 (LinkedIn, X, Instagram feed)
    s_path = os.path.join(VIDEOS_DIR, "404killer_ad_bleed_square.mp4")
    render_video(s_path, width=1080, height=1080, fps=24, duration=7.5)

    # 3. Email GIF (600x600 for cold outreach email embeds)
    g_path = os.path.join(VIDEOS_DIR, "404killer_ad_bleed_email.gif")
    render_gif(g_path, width=600, height=600, fps=10, duration=7.5)
