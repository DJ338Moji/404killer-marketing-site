import tls from 'tls';

const TARGET_MAP = {
  freestar: 'Freestar (Kurt Donnell / David Freedman)',
  raptive: 'Raptive (Michael Sanchez / Paul Bannister)',
  sovrn: 'Sovrn (Walter Knapp)',
  playwire: 'Playwire (Jayson Dubin / Nick Branstator)',
  mediavine: 'Mediavine (Eric Hochberger / Amanda Martin)',
  snigel: 'Snigel (Publisher Collective / Andrew Buckman)',
  ezoic: 'Ezoic (Tyler Bishop)',
  publift: 'Publift (Amy Jansen-Flynn)',
  monumetric: 'Monumetric (Kevin Kirkland)',
  venatus: 'Venatus (Dora Michail-Clendinnen)',
  test: 'Internal Verification Test (Dale Johnson)'
};

function sendSmtpEmail({ to, subject, htmlBody }) {
  const user = 'djohnson@404killer.com';
  const pass = 'ihrixcvnslprwioq';
  const fromName = 'AdSentinel Executive Radar';

  return new Promise((resolve, reject) => {
    const socket = tls.connect(465, 'smtp.gmail.com', {
      servername: 'smtp.gmail.com',
      rejectUnauthorized: true
    });

    let buffer = '';
    let step = 0;

    function sendLine(str) {
      socket.write(str + '\r\n');
    }

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      while (buffer.includes('\r\n')) {
        const lineEnd = buffer.indexOf('\r\n');
        const rawLine = buffer.slice(0, lineEnd);
        buffer = buffer.slice(lineEnd + 2);

        const match = rawLine.match(/^(\d{3})([ -])(.*)$/);
        if (match) {
          const code = parseInt(match[1], 10);
          const isFinal = match[2] === ' ';

          if (!isFinal) continue;

          if (code >= 400 && code <= 599) {
            socket.destroy();
            return reject(new Error(`SMTP Error ${code}: ${rawLine}`));
          }

          if (step === 0 && code === 220) {
            step = 1;
            sendLine('EHLO 404killer.com');
          } else if (step === 1 && code === 250) {
            step = 2;
            sendLine('AUTH LOGIN');
          } else if (step === 2 && code === 334) {
            step = 3;
            sendLine(Buffer.from(user).toString('base64'));
          } else if (step === 3 && code === 334) {
            step = 4;
            sendLine(Buffer.from(pass).toString('base64'));
          } else if (step === 4 && code === 235) {
            step = 5;
            sendLine(`MAIL FROM:<${user}>`);
          } else if (step === 5 && code === 250) {
            step = 6;
            sendLine(`RCPT TO:<${to}>`);
          } else if (step === 6 && code === 250) {
            step = 7;
            sendLine('DATA');
          } else if (step === 7 && code === 354) {
            step = 8;
            const msgId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@404killer.com>`;
            const emailData = [
              `Date: ${new Date().toUTCString()}`,
              `Message-ID: ${msgId}`,
              `From: "${fromName}" <${user}>`,
              `To: <${to}>`,
              `Subject: ${subject}`,
              'MIME-Version: 1.0',
              'Content-Type: text/html; charset=UTF-8',
              'Content-Transfer-Encoding: 8bit',
              '',
              htmlBody.replace(/\r?\n/g, '\r\n'),
              '.'
            ].join('\r\n');
            sendLine(emailData);
          } else if (step === 8 && code === 250) {
            step = 9;
            sendLine('QUIT');
            socket.end();
            return resolve({ success: true, timestamp: new Date().toISOString() });
          }
        }
      }
    });

    socket.on('error', (err) => {
      socket.destroy();
      reject(err);
    });

    socket.setTimeout(12000, () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out after 12s'));
    });
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = req.method === 'POST' ? req.body : req.query;
    const ref = (data?.ref || req.query?.ref || 'unknown').toLowerCase();
    const page = data?.page || req.query?.page || '/adsentinel';
    const userAgent = req.headers['user-agent'] || data?.userAgent || 'Unknown Device';

    const city = req.headers['x-vercel-ip-city'] || 'Scottsdale / Phoenix Area';
    const region = req.headers['x-vercel-ip-country-region'] || 'AZ';
    const country = req.headers['x-vercel-ip-country'] || 'US';
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'Hidden IP';

    const companyName = TARGET_MAP[ref] || (ref !== 'unknown' ? `Unknown Lead (${ref})` : 'Direct Executive / Organic Visitor');
    const isPriorityTarget = Boolean(TARGET_MAP[ref]);

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Phoenix',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const isMobile = /mobile|iphone|ipad|android/i.test(userAgent);
    const deviceType = isMobile ? '📱 Mobile Device' : '💻 Desktop / Laptop';

    const subject = isPriorityTarget
      ? `🚨 PRIORITY ALERT: ${companyName} is on AdSentinel!`
      : `👀 Visitor Alert: ${companyName} (${city}, ${region})`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
        <div style="background: #0f172a; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #38bdf8; margin: 0; font-size: 18px; letter-spacing: -0.5px;">AdSentinel™ Real-Time Radar</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Executive Engagement Detected</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 35%;">Identified Entity:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 800; font-size: 16px;">${companyName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Tracking Token:</td>
            <td style="padding: 10px 0; font-family: monospace; color: #2563eb; font-weight: bold;">?ref=${ref}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Page Viewed:</td>
            <td style="padding: 10px 0; color: #0f172a;"><a href="https://404killer.com${page}" style="color: #2563eb; text-decoration: none;">https://404killer.com${page}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Location:</td>
            <td style="padding: 10px 0; color: #0f172a;">${city}, ${region} (${country}) [IP: ${ip}]</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Device:</td>
            <td style="padding: 10px 0; color: #0f172a;">${deviceType}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Timestamp:</td>
            <td style="padding: 10px 0; color: #0f172a;">${timestamp} MST</td>
          </tr>
        </table>

        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; padding: 12px 14px; border-radius: 4px; font-size: 13px; color: #334155; line-height: 1.45;">
          <strong>Suggested Action:</strong><br>
          ${isPriorityTarget 
            ? `Prospect is actively reading the AdSentinel architecture. Have your <strong>2-page MNDA</strong> and technical staging sandbox recipe (<code>?adsentinel_test=1</code>) ready for follow-up.`
            : `Visitor is reviewing AdSentinel infrastructure.`}
        </div>

        <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
          DevRevIQ, LLC • AdSentinel™ &amp; 404 Killer™ • US Patent 11,805,132 B2
        </div>
      </div>
    `;

    await sendSmtpEmail({
      to: 'djohnson@404killer.com',
      subject,
      htmlBody
    });

    return res.status(200).json({
      success: true,
      deliveredTo: 'djohnson@404killer.com',
      identifiedCompany: companyName,
      ref,
      timestamp
    });
  } catch (err) {
    console.error('Alert error:', err);
    return res.status(200).json({ success: false, error: err.message });
  }
}
