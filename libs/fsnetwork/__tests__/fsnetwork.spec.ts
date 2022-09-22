import { FSNetwork } from '../src';

describe('FSNetwork', () => {
  it('get request', async () => {
    const network = new FSNetwork();

    await network.get('https://www.brandingbrand.com').then((response) => {
      expect(response.status).toBe(200);
    });
  });

  it('default base URL', async () => {
    const network = new FSNetwork({
      baseURL: 'https://www.brandingbrand.com',
    });

    await network.get('/careers').then((response) => {
      expect(response.status).toBe(200);
    });
  });
});
