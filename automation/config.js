const path = require('path');
const fs = require('fs');

// Try loading environment variables if available
const envFiles = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../../MojipassProjects/mojipass-shopify-app/.env'),
  path.resolve(__dirname, '../../MojipassProjects/mojipass-shopify-app/.env')
];

for (const envFile of envFiles) {
  try {
    if (fs.existsSync(envFile)) {
      const lines = fs.readFileSync(envFile, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [k, ...v] = trimmed.split('=');
          const key = k.trim();
          let val = v.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {
    // Ignore restricted files outside current workspace
  }
}

const config = {
  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'renuiq.myshopify.com',
    clientId: process.env.SHOPIFY_CLIENT_ID || '',
    clientSecret: process.env.SHOPIFY_CLIENT_SECRET || '',
    newsBlogId: 120003690799,
    liveThemeId: 183192256815,
    primaryDomain: 'https://renuiq.com'
  },
  mojipass: {
    marketingDomain: 'https://www.mojipass.com',
    rootDomain: 'https://mojipass.com',
    partnerDomain: 'https://partner.mojipass.com',
    appDomain: 'https://app.mojipass.com',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:rtEkxLTWQpWhEZjNpViJYYDEWJiGyoEN@shinkansen.proxy.rlwy.net:49798/railway?sslmode=no-verify',
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || 'my-shopify-app-db',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@my-shopify-app-db.iam.gserviceaccount.com',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').replace(/"/g, '')
    }
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyCTMlr8daolz2CjxTQ58cXi1zOUIQpWaJU'
  },
  email: {
    to: process.env.REPORT_RECIPIENT_EMAIL || 'djohnson@mojipass.com',
    from: process.env.REPORT_FROM_EMAIL || 'reports@mojipass.com',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    },
    resendApiKey: process.env.RESEND_API_KEY || '',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    postmarkToken: process.env.POSTMARK_SERVER_TOKEN || ''
  },
  paths: {
    logsDir: path.resolve(__dirname, 'logs'),
    sectionsDir: path.resolve(__dirname, '../sections')
  }
};

module.exports = config;
