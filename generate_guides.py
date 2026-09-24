import os

def create_pdf(filename, title, subtitle, sections):
    # Escape parentheses and backslashes for PDF text strings
    def escape_pdf(text):
        return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

    lines = []
    lines.append('BT')
    
    # Header Branding
    lines.append('0.06 0.59 0.40 rg') # Emerald color #10b981
    lines.append('/F2 20 Tf')
    lines.append('50 740 Td')
    lines.append(f'({escape_pdf(title)}) Tj')
    
    lines.append('0 -18 Td')
    lines.append('/F1 11 Tf')
    lines.append('0.4 0.4 0.4 rg') # Gray subtitle
    lines.append(f'({escape_pdf(subtitle)}) Tj')
    
    # Divider bar
    lines.append('ET')
    lines.append('q')
    lines.append('0.06 0.59 0.40 rg')
    lines.append('50 710 512 2 re f')
    lines.append('Q')
    
    lines.append('BT')
    lines.append('0.1 0.1 0.1 rg')
    
    current_y = 685
    lines.append(f'50 {current_y} Td')
    
    for heading, paragraphs in sections:
        # Section Heading
        lines.append('/F2 13 Tf')
        lines.append('0.05 0.3 0.2 rg')
        lines.append(f'({escape_pdf(heading)}) Tj')
        lines.append('0 -16 Td')
        current_y -= 16
        
        # Section Content
        lines.append('/F1 9.5 Tf')
        lines.append('0.2 0.2 0.2 rg')
        for p in paragraphs:
            lines.append(f'({escape_pdf(p)}) Tj')
            lines.append('0 -13 Td')
            current_y -= 13
        
        # Spacing before next section
        lines.append('0 -10 Td')
        current_y -= 10

    # Footer
    lines.append('ET')
    lines.append('q')
    lines.append('0.8 0.8 0.8 rg')
    lines.append('50 50 512 1 re f')
    lines.append('Q')
    lines.append('BT')
    lines.append('/F1 8 Tf')
    lines.append('0.5 0.5 0.5 rg')
    lines.append('50 38 Td')
    lines.append('(Mojipass(R) Ecosystem - Official Documentation - support@mojipass.com - www.mojipass.com) Tj')
    lines.append('ET')

    stream_content = '\n'.join(lines)
    stream_bytes = stream_content.encode('latin1', errors='replace')

    objects = []
    # 1: Catalog
    objects.append(b'<< /Type /Catalog /Pages 2 0 R >>')
    # 2: Pages
    objects.append(b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
    # 3: Page
    objects.append(b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>')
    # 4: Stream
    stream_obj = f'<< /Length {len(stream_bytes)} >>\nstream\n'.encode('latin1') + stream_bytes + b'\nendstream'
    objects.append(stream_obj)
    # 5: Regular Font
    objects.append(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
    # 6: Bold Font
    objects.append(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

    pdf = bytearray(b'%PDF-1.4\n')
    xref = [0]
    for i, obj in enumerate(objects):
        xref.append(len(pdf))
        pdf.extend(f'{i+1} 0 obj\n'.encode('latin1'))
        pdf.extend(obj)
        pdf.extend(b'\nendobj\n')

    xref_pos = len(pdf)
    pdf.extend(b'xref\n')
    pdf.extend(f'0 {len(objects)+1}\n'.encode('latin1'))
    pdf.extend(b'0000000000 65535 f \n')
    for offset in xref[1:]:
        pdf.extend(f'{offset:010d} 000000 n \n'.encode('latin1'))

    pdf.extend(b'trailer\n')
    pdf.extend(f'<< /Size {len(objects)+1} /Root 1 0 R >>\n'.encode('latin1'))
    pdf.extend(b'startxref\n')
    pdf.extend(f'{xref_pos}\n'.encode('latin1'))
    pdf.extend(b'%%EOF\n')

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(pdf)
    print(f"Generated {filename} ({len(pdf)} bytes)")

GUIDES = [
    (
        "merchant_onboarding_guide.pdf",
        "Mojipass(R) Shopify Merchant Onboarding Guide",
        "Zero-CAC Cross-Promotional Commerce Network & Checkout Synergy",
        [
            ("1. Executive Summary & Economics", [
                "Rising paid social ad costs and privacy changes have compressed e-commerce gross margins.",
                "Mojipass provides an alternative: zero-ad-spend customer acquisition via peer-to-peer brand synergy.",
                "Merchants co-promote complementary, non-competing partner offers on post-purchase thank-you pages.",
                "You only pay when a customer redeems and completes a purchase. No subscription or upfront fees."
            ]),
            ("2. Fast-Track Shopify App Installation", [
                "1. Locate 'Mojipass' in the Shopify App Store and click 'Install App'.",
                "2. Grant read/write permissions for orders, products, and checkout script extensions.",
                "3. OAuth authentication completes automatically in under 60 seconds with no code required.",
                "4. Your catalog automatically syncs to your private Mojipass Merchant Portal."
            ]),
            ("3. AI Synergy Engine & Brand Pairing", [
                "Our proprietary matching engine evaluates your customer demographics and product categories.",
                "Your store is paired exclusively with non-competing, affinity-matched Shopify brands.",
                "Example: A barrier-repair skincare brand is paired with clean organic body wash, never a competitor.",
                "You maintain 100% control to review, accept, or pause brand pairings at any time."
            ]),
            ("4. Post-Purchase Placements & Attribution", [
                "Partner offers appear dynamically on your order confirmation page without slowing checkout.",
                "Triple-redundant attribution tracks orders via discount codes, landing site tokens, and note attributes.",
                "Track conversions, impressions, and reciprocal earned commissions live in your dashboard."
            ]),
            ("5. Support & Integration Assistance", [
                "Technical and developer support is available 24/7 at support@mojipass.com.",
                "Merchant documentation and API playground guides are accessible at https://www.mojipass.com."
            ])
        ]
    ),
    (
        "brand_onboarding_guide.pdf",
        "Mojipass(R) Sponsoring Brand Playbook",
        "Targeted Customer Acquisition & Product Sampling at Scale",
        [
            ("1. Program Overview", [
                "Distribute full-size rewards and trial products directly to high-intent shoppers at checkout.",
                "Capture new customers at the precise moment of purchase on verified partner merchant stores.",
                "Zero waste: Offers are only presented to shoppers whose purchase history matches your demographic."
            ]),
            ("2. Setting Up Your Sponsoring Campaign", [
                "1. Access the Mojipass Brand Portal at https://brand.mojipass.com.",
                "2. Define your target CPA (Cost Per Acquisition) and set your promotional inventory budget.",
                "3. Select qualifying product categories and upload high-resolution product creative.",
                "4. Set geographic rules and minimum cart values for offer eligibility."
            ]),
            ("3. Closed-Loop Performance Analytics", [
                "Monitor real-time customer acquisition metrics, redemption rates, and downstream lifetime value (LTV).",
                "All transactions are settled securely with automated escrow and invoice reconciliation."
            ])
        ]
    ),
    (
        "partner_onboarding_guide.pdf",
        "Mojipass(R) Creator & Affiliate Partner Guide",
        "Monetize Your Audience with Verified High-Converting Commerce Offers",
        [
            ("1. Welcome to the Partner Network", [
                "Mojipass connects creators, influencers, and affiliates with premium e-commerce brand rewards.",
                "Earn industry-leading commissions every time a follower redeems an exclusive sponsored reward.",
                "No complicated affiliate networks: One dashboard, instant link generation, and weekly payouts."
            ]),
            ("2. Getting Started in 3 Steps", [
                "1. Complete partner registration at https://partner.mojipass.com/accept-invite.",
                "2. Connect your payout details via Stripe Connect for automated direct deposit.",
                "3. Select partner brands aligned with your content and generate your unique synergy links."
            ]),
            ("3. Best Practices for Maximizing Earnings", [
                "Share synergy links in link-in-bio, YouTube descriptions, and TikTok/Instagram story highlights.",
                "Highlight the shopper benefit: Your audience receives genuine sponsored rewards, not just small discounts.",
                "Track live clicks, conversions, and accrued commission earnings in your real-time partner portal."
            ])
        ]
    ),
    (
        "shopper_onboarding_guide.pdf",
        "Mojipass(R) Shopper Rewards & Loyalty Guide",
        "How Free Sponsored Rewards & Gifts Work at Checkout",
        [
            ("1. The Shopper Reward Experience", [
                "When you shop at participating merchants in the Mojipass network, you unlock free sponsored rewards.",
                "These are not sample sachets: You receive genuine full-sized products sponsored by partner brands.",
                "There are no hidden subscriptions, trial traps, or unexpected recurring credit card charges."
            ]),
            ("2. Redeeming Your Free Gift", [
                "1. Complete your purchase as normal on any Mojipass-enabled online store.",
                "2. Choose your preferred sponsored gift on the order confirmation screen.",
                "3. Your free reward is shipped directly with tracking information sent to your email."
            ]),
            ("3. Consumer Privacy & Data Guarantee", [
                "We never sell your personal information or spam your inbox with third-party advertising.",
                "Your information is only used to fulfill the specific reward you have selected.",
                "For inquiries, contact support@mojipass.com or visit https://www.mojipass.com/privacy."
            ])
        ]
    )
]

target_dirs = [
    "/Users/dalejohnson/Documents/Documents - Dale’s MacBook Air/Mojipass/MojipassProjects/mojipass-marketing-site/public/assets/guides",
    "/Users/dalejohnson/Documents/Documents - Dale’s MacBook Air/Mojipass/MojipassProjects/mojipass-marketing-site/dist/assets/guides"
]

for filename, title, subtitle, sections in GUIDES:
    for t_dir in target_dirs:
        full_path = os.path.join(t_dir, filename)
        create_pdf(full_path, title, subtitle, sections)

print("All onboarding guide PDFs generated successfully!")
