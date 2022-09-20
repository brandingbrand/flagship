import base64 from '@brandingbrand/utils-base64';

if (!globalThis.btoa) {
  globalThis.btoa = base64.encode;
}

if (!globalThis.atob) {
  globalThis.atob = base64.decode;
}
