const https = require('https');
const http = require('http');
const { URL } = require('url');

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

class Crawler {
  normalizeUrl(rawUrl, baseUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const trimmed = rawUrl.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('javascript:') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
      return null;
    }

    try {
      const u = new URL(trimmed, baseUrl);
      u.hash = ''; // Remove fragment
      return u.href;
    } catch (e) {
      return null;
    }
  }

  extractLinks(html, baseUrl) {
    if (!html || typeof html !== 'string') return [];
    const linkRegex = /href=["']([^"']+)["']/gi;
    const links = new Set();
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const normalized = this.normalizeUrl(match[1], baseUrl);
      if (normalized) {
        links.add(normalized);
      }
    }

    return Array.from(links);
  }

  async fetchHtml(targetUrl, timeoutMs = 12000) {
    return new Promise((resolve) => {
      try {
        const u = new URL(targetUrl);
        const client = u.protocol === 'https:' ? https : http;

        const req = client.get(u.href, {
          headers: { 'User-Agent': DEFAULT_USER_AGENT },
          timeout: timeoutMs
        }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = this.normalizeUrl(res.headers.location, targetUrl);
            if (redirectUrl) {
              return resolve(this.fetchHtml(redirectUrl, timeoutMs));
            }
          }

          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, html: data }));
        });

        req.on('error', (err) => resolve({ status: 'ERROR', error: err.message, html: '' }));
        req.on('timeout', () => {
          req.destroy();
          resolve({ status: 'TIMEOUT', error: 'Request timed out', html: '' });
        });
      } catch (err) {
        resolve({ status: 'INVALID_URL', error: err.message, html: '' });
      }
    });
  }

  async testUrl(targetUrl, maxRedirects = 5, timeoutMs = 10000) {
    const startTime = Date.now();
    let currentUrl = targetUrl;
    const redirectChain = [];

    for (let i = 0; i < maxRedirects; i++) {
      const res = await new Promise((resolve) => {
        try {
          const u = new URL(currentUrl);
          const client = u.protocol === 'https:' ? https : http;

          const req = client.request({
            hostname: u.hostname,
            port: u.port || (u.protocol === 'https:' ? 443 : 80),
            path: u.pathname + u.search,
            method: 'GET',
            headers: {
              'User-Agent': DEFAULT_USER_AGENT,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: timeoutMs
          }, (response) => {
            let firstChunk = Buffer.alloc(0);
            let bytesReceived = 0;
            response.on('data', (chunk) => {
              bytesReceived += chunk.length;
              if (firstChunk.length < 512) {
                firstChunk = Buffer.concat([firstChunk, chunk]);
              }
            });
            response.on('end', () => {
              const contentLength = response.headers['content-length'] 
                ? parseInt(response.headers['content-length'], 10) 
                : bytesReceived;
              const contentType = response.headers['content-type'] || '';
              
              resolve({
                status: response.statusCode,
                location: response.headers.location,
                contentLength,
                contentType,
                bytesReceived,
                firstChunk
              });
            });
          });

          req.on('error', (err) => resolve({ status: 'ERROR', error: err.message, bytesReceived: 0, firstChunk: Buffer.alloc(0) }));
          req.on('timeout', () => {
            req.destroy();
            resolve({ status: 'TIMEOUT', error: 'Timeout', bytesReceived: 0, firstChunk: Buffer.alloc(0) });
          });
          req.end();
        } catch (e) {
          resolve({ status: 'INVALID_URL', error: e.message, bytesReceived: 0, firstChunk: Buffer.alloc(0) });
        }
      });

      if (res.status >= 300 && res.status < 400 && res.location) {
        const nextUrl = this.normalizeUrl(res.location, currentUrl);
        redirectChain.push({ from: currentUrl, to: nextUrl, status: res.status });
        if (!nextUrl || nextUrl === currentUrl) break;
        currentUrl = nextUrl;
      } else {
        const durationMs = Date.now() - startTime;
        const isPdf = currentUrl.toLowerCase().endsWith('.pdf') || (res.contentType && res.contentType.includes('application/pdf'));
        
        let isCorrupt = false;
        let corruptReason = null;

        // 1. Detect 0-byte payload for documents and assets
        if (res.status === 200 && (res.contentLength === 0 || res.bytesReceived === 0)) {
          isCorrupt = true;
          corruptReason = 'Empty 0-byte document (Zero payload received)';
        }

        // 2. Validate PDF signature (%PDF-)
        if (res.status === 200 && isPdf && !isCorrupt) {
          const header = res.firstChunk ? res.firstChunk.toString('latin1', 0, 5) : '';
          if (!header.startsWith('%PDF')) {
            isCorrupt = true;
            corruptReason = `Invalid PDF header: expected '%PDF' but received '${header.trim() || 'HTML/Text'}'`;
          }
        }

        const isError = typeof res.status === 'string' || res.status >= 400 || isCorrupt;

        return {
          initialUrl: targetUrl,
          finalUrl: currentUrl,
          status: isCorrupt ? `CORRUPT: ${corruptReason}` : res.status,
          statusCode: res.status,
          contentLength: res.contentLength,
          contentType: res.contentType,
          redirectChain,
          is404: res.status === 404,
          isCorrupt,
          corruptReason,
          isError,
          durationMs
        };
      }
    }

    return {
      initialUrl: targetUrl,
      finalUrl: currentUrl,
      status: 'TOO_MANY_REDIRECTS',
      redirectChain,
      is404: false,
      isError: true,
      durationMs: Date.now() - startTime
    };
  }

  async auditBatch(urls, concurrency = 3, delayMs = 150) {
    const results = [];
    const queue = [...urls];

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const workers = Array(concurrency).fill(0).map(async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (!url) break;

        let result = await this.testUrl(url);

        // If rate-limited (429), back off and retry once
        if (result.status === 429) {
          await sleep(1500);
          result = await this.testUrl(url);
        }

        results.push(result);
        if (delayMs > 0) {
          await sleep(delayMs);
        }
      }
    });

    await Promise.all(workers);
    return results;
  }
}

module.exports = new Crawler();
