import type { Request, Response } from 'express';
import type * as http from 'http';
import type { Options } from 'http-proxy-middleware';

const removeDWCookies = (req: Request, res: Response) => {
  const cookies = (req.get('Cookie') || '').split('; ');

  const filtered: string[] = ['dwanonymous', 'dwsecuretoken', 'dwsid']
    .map((str: string) => cookies.find((co) => co.startsWith(str)))
    .filter(Boolean) as string[];

  for (const cookie of filtered) {
    const key = cookie.split('=')[0];
    if (key) {
      res.clearCookie(key);
    }
  }
};

const mutateDWCookies = (setCookieHeaders: string[], _req: Request) => {
  if (!setCookieHeaders || setCookieHeaders.length === 0) {
    return setCookieHeaders;
  }

  return setCookieHeaders.map((cookie) => {
    if (cookie.startsWith('dwsid')) {
      cookie = cookie.replace(/httponly;?/gi, '');
    }

    if (
      (cookie.startsWith('dwsid') || cookie.startsWith('dwsecuretoken')) &&
      !cookie.toLowerCase().includes('expires') &&
      !cookie.toLowerCase().includes('max-age')
    ) {
      const expiration = 60 * 60 * 24 * 7; // 7 days
      cookie = cookie.trim().endsWith(';')
        ? `${cookie} max-age=${expiration}`
        : `${cookie}; max-age=${expiration}`;
    }

    if (process.env.NODE_ENV !== 'production' && _req.hostname === 'localhost') {
      cookie = cookie.replace(/secure;/gi, '');
    }

    return cookie;
  });
};

export const demandwareProxyConfig: Partial<Options> = {
  onProxyReq: (proxyReq: http.ClientRequest, _req: Request, _res: Response): void => {
    proxyReq.removeHeader('location');
    proxyReq.removeHeader('origin');
    proxyReq.removeHeader('referer');
  },
  onProxyRes: (proxyRes: http.IncomingMessage, _req: Request, _res: Response): void => {
    if (proxyRes.headers['set-cookie']) {
      proxyRes.headers['set-cookie'] = mutateDWCookies(proxyRes.headers['set-cookie'], _req);
    }

    if (_req.method.toUpperCase() === 'DELETE' && _req.url.includes('customers/auth')) {
      removeDWCookies(_req, _res);
    }
  },
};

module.exports = {
  demandwareProxyConfig,
};
