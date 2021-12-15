import FSNetwork from '../src/index';

describe('FSNetwork', () => {
  test('get request', async () => {
    const network = new FSNetwork();

    return network.get('https://www.brandingbrand.com').then((response) => {
      expect(response.status).toBe(200);
    });
  });

  test('default base URL', async () => {
    const network = new FSNetwork({
      baseURL: 'https://www.brandingbrand.com',
    });

    return network.get('/careers').then((response) => {
      expect(response.status).toBe(200);
    });
  });
});
