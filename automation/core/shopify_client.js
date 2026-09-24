const https = require('https');
const querystring = require('querystring');
const config = require('../config');

class ShopifyClient {
  constructor() {
    this.storeDomain = config.shopify.storeDomain;
    this.clientId = config.shopify.clientId;
    this.clientSecret = config.shopify.clientSecret;
    this.token = null;
    this.tokenExpiresAt = null;
  }

  async getToken() {
    if (this.token && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 60000) {
      return this.token;
    }

    return new Promise((resolve, reject) => {
      const postData = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

      const req = https.request({
        hostname: this.storeDomain,
        path: '/admin/oauth/access_token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            this.token = parsed.access_token;
            this.tokenExpiresAt = Date.now() + ((parsed.expires_in || 86400) * 1000);
            resolve(this.token);
          } else {
            reject(new Error(`Failed to obtain Shopify token: HTTP ${res.statusCode} - ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  async request(method, endpoint, payload = null) {
    const token = await this.getToken();
    return new Promise((resolve, reject) => {
      const postData = payload ? JSON.stringify(payload) : null;
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const req = https.request({
        hostname: this.storeDomain,
        path: `/admin/api/2024-04/${cleanEndpoint}`,
        method,
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
        }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });
      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }

  async getAllProducts() {
    const res = await this.request('GET', 'products.json?limit=250');
    return res.body?.products || [];
  }

  async getAllCollections() {
    const [smart, custom] = await Promise.all([
      this.request('GET', 'smart_collections.json?limit=250'),
      this.request('GET', 'custom_collections.json?limit=250')
    ]);
    return [...(smart.body?.smart_collections || []), ...(custom.body?.custom_collections || [])];
  }

  async getAllPages() {
    const res = await this.request('GET', 'pages.json?limit=250');
    return res.body?.pages || [];
  }

  async getAllBlogs() {
    const res = await this.request('GET', 'blogs.json');
    return res.body?.blogs || [];
  }

  async getBlogArticles(blogId) {
    const res = await this.request('GET', `blogs/${blogId}/articles.json?limit=250`);
    return res.body?.articles || [];
  }

  async createArticle(blogId, article) {
    const payload = {
      article: {
        ...article,
        published: true,
        published_at: article.published_at || new Date().toISOString()
      }
    };
    return this.request('POST', `blogs/${blogId}/articles.json`, payload);
  }

  async listRedirects() {
    const res = await this.request('GET', 'redirects.json?limit=250');
    return res.body?.redirects || [];
  }

  async createRedirect(path, target) {
    const payload = {
      redirect: {
        path,
        target
      }
    };
    return this.request('POST', 'redirects.json', payload);
  }

  async getThemeAsset(themeId, key) {
    return this.request('GET', `themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  }

  async updateThemeAsset(themeId, key, value) {
    return this.request('PUT', `themes/${themeId}/assets.json`, {
      asset: {
        key,
        value
      }
    });
  }
}

module.exports = new ShopifyClient();
