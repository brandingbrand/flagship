import { Request, Response } from 'express';
import { Options } from 'http-proxy-middleware';
import * as http from 'http';

const removeDWCookies = (req: Request, res: Response) => {
  const cookies = (req.get('Cookie') || '').split('; ');

  const filtered: string[] = ['dwanonymous', 'dwsecuretoken', 'dwsid']
    .map((str: string) => {
      return cookies.find(co => co.indexOf(str) === 0);
    })
    .filter(Boolean) as string[];

  filtered.forEach(cookie => {
    const key = cookie.split('=')[0];
    res.clearCookie(key);
  });
};

const mutateDWCookies = (setCookieHeaders: string[], _req: Request) => {
  if (!setCookieHeaders || !setCookieHeaders.length) {
    return setCookieHeaders;
  }

  return setCookieHeaders.map(cookie => {
    if (cookie.indexOf('dwsid') === 0) {
      cookie = cookie.replace(/HttpOnly;?/gi, '');
    }

    if (
      (cookie.indexOf('dwsid') === 0 ||
        cookie.indexOf('dwsecuretoken') === 0) &&
      (cookie.toLowerCase().indexOf('expires') === -1 &&
        cookie.toLowerCase().indexOf('max-age') === -1)
    ) {
      const expiration = 60 * 60 * 24 * 7; // 7 days
      cookie =
        cookie.trim().substr(-1) === ';'
          ? `${cookie} max-age=${expiration}`
          : `${cookie}; max-age=${expiration}`;
    }

    if (process.env.NODE_ENV !== 'production' && _req.hostname === 'localhost') {
      cookie = cookie.replace(/Secure;/gi, '');
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
      proxyRes.headers['set-cookie'] = mutateDWCookies(
        proxyRes.headers['set-cookie'],
        _req
      );
    }

    if (
      _req.method.toUpperCase() === 'DELETE' &&
      _req.url.indexOf('customers/auth') > -1
    ) {
      removeDWCookies(_req, _res);
    }
  }
};

module.exports = {
  demandwareProxyConfig
};
