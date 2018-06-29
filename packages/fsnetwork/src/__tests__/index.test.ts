import FSNetwork from '../index';

describe('FSNetwork', () => {
  test('get request', async () => {
    const network = new FSNetwork();

    return network.get('https://github.com').then(response => {
      expect(response.status).toBe(200);
    });
  });

  test('default base URL', async () => {
    const network = new FSNetwork({
      baseURL: 'https://github.com'
    });

    return network.get('/brandingbrand').then(response => {
      expect(response.status).toBe(200);
    });
  });
});
