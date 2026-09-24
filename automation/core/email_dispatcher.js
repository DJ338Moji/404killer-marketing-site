const fs = require('fs');
const path = require('path');
const https = require('https');
const net = require('net');
const tls = require('tls');
const config = require('../config');

class EmailDispatcher {
  constructor() {
    this.emailConfig = config.email;
    this.logsDir = config.paths.logsDir;
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Save digest locally to log archive
   */
  archiveDigest(subject, text, html) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlPath = path.join(this.logsDir, `email_digest_latest.html`);
    const mdPath = path.join(this.logsDir, `email_digest_latest.md`);
    const archiveHtmlPath = path.join(this.logsDir, `digest_${timestamp}.html`);

    fs.writeFileSync(htmlPath, html || text, 'utf8');
    fs.writeFileSync(mdPath, text || html, 'utf8');
    fs.writeFileSync(archiveHtmlPath, html || text, 'utf8');

    return { htmlPath, mdPath, archiveHtmlPath };
  }

  /**
   * Send email using Resend REST API
   */
  async sendViaResend(options) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        from: options.from || this.emailConfig.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text
      });

      const req = https.request({
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.emailConfig.resendApiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 10000
      }, res => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, provider: 'Resend', response: body });
          } else {
            reject(new Error(`Resend API error (${res.statusCode}): ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Resend API request timed out'));
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Send email using SendGrid REST API
   */
  async sendViaSendGrid(options) {
    return new Promise((resolve, reject) => {
      const recipients = (Array.isArray(options.to) ? options.to : [options.to]).map(e => ({ email: e }));
      const payload = JSON.stringify({
        personalizations: [{ to: recipients }],
        from: { email: options.from || this.emailConfig.from },
        subject: options.subject,
        content: [
          { type: 'text/plain', value: options.text || '' },
          { type: 'text/html', value: options.html || options.text || '' }
        ]
      });

      const req = https.request({
        hostname: 'api.sendgrid.com',
        path: '/v3/mail/send',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.emailConfig.sendgridApiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 10000
      }, res => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, provider: 'SendGrid', response: body });
          } else {
            reject(new Error(`SendGrid API error (${res.statusCode}): ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('SendGrid API request timed out'));
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Native Node.js SMTP transport (TLS/SSL or STARTTLS)
   */
  async sendViaSmtp(options) {
    const { host, port, secure, user, pass } = this.emailConfig.smtp;
    if (!host) {
      throw new Error('SMTP host is not configured');
    }

    return new Promise((resolve, reject) => {
      const isDirectTls = secure || port === 465;
      const socket = isDirectTls 
        ? tls.connect({ host, port, timeout: 15000 })
        : net.createConnection({ host, port, timeout: 15000 });

      let buffer = '';
      let step = 0;

      const sendLine = (line) => {
        socket.write(line + '\r\n');
      };

      socket.on('data', (data) => {
        buffer += data.toString();
        const lines = buffer.split('\r\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.match(/^\d{3} /)) {
            const code = parseInt(line.substring(0, 3), 10);
            if (code >= 400) {
              socket.end();
              return reject(new Error(`SMTP error (${code}): ${line}`));
            }

            if (step === 0 && code === 220) {
              step = 1;
              sendLine(`EHLO mojipass.local`);
            } else if (step === 1 && code === 250) {
              if (user && pass) {
                step = 2;
                sendLine('AUTH LOGIN');
              } else {
                step = 4;
                sendLine(`MAIL FROM:<${options.from || this.emailConfig.from}>`);
              }
            } else if (step === 2 && code === 334) {
              step = 3;
              sendLine(Buffer.from(user).toString('base64'));
            } else if (step === 3 && code === 334) {
              step = 4;
              sendLine(Buffer.from(pass).toString('base64'));
            } else if (step === 4 && (code === 235 || code === 250)) {
              step = 5;
              sendLine(`MAIL FROM:<${options.from || this.emailConfig.from}>`);
            } else if (step === 5 && code === 250) {
              step = 6;
              sendLine(`RCPT TO:<${options.to || this.emailConfig.to}>`);
            } else if (step === 6 && code === 250) {
              step = 7;
              sendLine('DATA');
            } else if (step === 7 && code === 354) {
              step = 8;
              const boundary = '----=_Part_' + Date.now();
              const mailContent = [
                `From: RenuIQ & Mojipass Sentinel <${options.from || this.emailConfig.from}>`,
                `To: <${options.to || this.emailConfig.to}>`,
                `Subject: ${options.subject}`,
                'MIME-Version: 1.0',
                `Content-Type: multipart/alternative; boundary="${boundary}"`,
                '',
                `--${boundary}`,
                'Content-Type: text/plain; charset=UTF-8',
                'Content-Transfer-Encoding: 7bit',
                '',
                options.text || '',
                '',
                `--${boundary}`,
                'Content-Type: text/html; charset=UTF-8',
                'Content-Transfer-Encoding: 7bit',
                '',
                options.html || options.text || '',
                '',
                `--${boundary}--`,
                '.'
              ].join('\r\n');
              sendLine(mailContent);
            } else if (step === 8 && code === 250) {
              step = 9;
              sendLine('QUIT');
              socket.end();
              return resolve({ success: true, provider: 'SMTP', host });
            }
          }
        }
      });

      socket.on('error', reject);
      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('SMTP connection timed out'));
      });
    });
  }

  /**
   * Main dispatch orchestrator
   */
  async sendWeeklyDigest(reportDetails) {
    const to = reportDetails.to || this.emailConfig.to;
    const from = reportDetails.from || this.emailConfig.from;
    const subject = reportDetails.subject || `🛡️ [Executive Summary] Weekly Autonomous Operations & Bot Activity: RenuIQ & Mojipass`;
    const text = reportDetails.text;
    const html = reportDetails.html;

    // 1. Always archive the output locally
    const fileArchive = this.archiveDigest(subject, text, html);
    console.log(`📁 Weekly email digest locally rendered and saved:`);
    console.log(`   - HTML: ${fileArchive.htmlPath}`);
    console.log(`   - Markdown: ${fileArchive.mdPath}`);

    // 2. Try remote dispatch providers
    let dispatchResult = null;
    let providerUsed = 'Local Archive (Standby)';

    if (this.emailConfig.resendApiKey) {
      try {
        dispatchResult = await this.sendViaResend({ to, from, subject, text, html });
        providerUsed = 'Resend';
        console.log(`✅ Email successfully transmitted via Resend API to ${to}`);
      } catch (err) {
        console.warn(`⚠️ Resend dispatch failed: ${err.message}`);
      }
    } else if (this.emailConfig.sendgridApiKey) {
      try {
        dispatchResult = await this.sendViaSendGrid({ to, from, subject, text, html });
        providerUsed = 'SendGrid';
        console.log(`✅ Email successfully transmitted via SendGrid API to ${to}`);
      } catch (err) {
        console.warn(`⚠️ SendGrid dispatch failed: ${err.message}`);
      }
    } else if (this.emailConfig.smtp.host && this.emailConfig.smtp.user) {
      try {
        dispatchResult = await this.sendViaSmtp({ to, from, subject, text, html });
        providerUsed = `SMTP (${this.emailConfig.smtp.host})`;
        console.log(`✅ Email successfully transmitted via SMTP to ${to}`);
      } catch (err) {
        console.warn(`⚠️ SMTP dispatch failed: ${err.message}`);
      }
    } else {
      console.log(`ℹ️ Remote email transport credentials (SMTP/Resend/SendGrid) not yet configured in environment.`);
      console.log(`   Digest generated with 100% fidelity in: ${fileArchive.htmlPath}`);
    }

    return {
      recipient: to,
      from,
      subject,
      providerUsed,
      dispatchedRemotely: Boolean(dispatchResult?.success),
      localHtmlPath: fileArchive.htmlPath,
      localMdPath: fileArchive.mdPath,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new EmailDispatcher();
