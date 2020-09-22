function removeDWCookies(req, res) {
  const cookies = (req.get('Cookie') || '').split('; ');

  ['dwanonymous', 'dwsecuretoken', 'dwsid']
    .map(str => cookies.find(co => co.indexOf(str) === 0))
    .filter(Boolean)
    .forEach(cookie => {
      const key = cookie.split('=')[0];
      res.clearCookie(key);
    });
}

function mutateDWCookies(setCookieHeaders, _req) {
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

    if (process.env.NODE_ENV !== 'production' && req.hostname === 'localhost') {
      cookie = cookie.replace(/Secure;/gi, '');
    }

    return cookie;
  });
}

const demandwareProxyConfig = {
  onProxyReq: function(proxyReq, _req, _res) {
    proxyReq.removeHeader('location');
    proxyReq.removeHeader('origin');
    proxyReq.removeHeader('referer');
  },
  onProxyRes: function(proxyRes, req, res) {
    proxyRes.headers['set-cookie'] = mutateDWCookies(
      proxyRes.headers['set-cookie'],
      req
    );

    if (
      req.method.toUpperCase() === 'DELETE' &&
      req.url.indexOf('customers/auth') > -1
    ) {
      removeDWCookies(req, res);
    }
  }
}

module.exports = {
  demandwareProxyConfig
};