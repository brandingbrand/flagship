import FSNetwork from '../index';
import { SSLPinningInstance } from '../lib/ssl';
import { SSLError } from '../lib/ssl/SSLError';
import { SSLResponse } from '../lib/ssl/SSLResponse';

const sslResponseMockData = {
  bodyString: '{"testString": "test", "testObject": {"1": "1", "2": [1, 2]}}',
  url: '/',
  headers: {
    'Content-Type': 'Application/json'
  },
  status: 200,
  json: async () => ({ testPromise: true }),
  text: async () => 'testText'
};

const sslErrorMockData = {
  bodyString: '{"message": "Invalid token", "statusText": "Unauthorized"}',
  url: '/',
  headers: {
    'Content-Type': 'Application/json'
  },
  status: 401,
  json: async () => ({ testPromise: true }),
  text: async () => 'testText'
};

describe('FSNetwork', () => {
  test('get request', async () => {
    const network = new FSNetwork();

    return network.get('https://www.brandingbrand.com').then(response => {
      expect(response.status).toBe(200);
    });
  });

  test('default base URL', async () => {
    const network = new FSNetwork({
      baseURL: 'https://www.brandingbrand.com'
    });

    return network.get('/careers').then(response => {
      expect(response.status).toBe(200);
    });
  });

  test('method HEAD should not be allowed with SSL pinning', async () => {
    const network = new FSNetwork({
      baseURL: 'https://github.com',
      pinnedCertificates: [{
        baseUrl: 'https://github.com',
        path: 'github.cer'
      }]
    });

    return expect(() => network.head('/').catch()).toThrowError(
      'Method HEAD not allowed for SSL Pinning request'
    );
  });

  test('method PATCH should not be allowed with SSL pinning', async () => {
    const network = new FSNetwork({
      baseURL: 'https://github.com',
      pinnedCertificates: [{
        baseUrl: 'https://github.com',
        path: 'github.cer'
      }]
    });

    return expect(() => network.patch('/').catch()).toThrowError(
      'Method PATCH not allowed for SSL Pinning request'
    );
  });

  test('create SSL Pinning instance', async () => {
    const network = new SSLPinningInstance(
      [{
        baseUrl: 'https://github.com',
        path: 'github.cer'
      }]
    );

    return expect(network).toBeInstanceOf(SSLPinningInstance);
  });

  test('create SSLResponse instance', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    return expect(response).toBeInstanceOf(SSLResponse);
  });

  // SSL Response
  test('SSL Response should have data', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    return expect(response)
      .toHaveProperty('data');
  });

  test('SSL Response should have status', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    return expect(response)
      .toHaveProperty('status');
  });


  test('SSL Response should have status 200', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    return expect(response.status).toBe(200);
  });

  test('SSL Response should should have valid data', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    const jsonResponse = JSON.parse(sslResponseMockData.bodyString);

    return expect(response.data)
      .toMatchObject(jsonResponse);
  });

  // SSLError
  test('create SSLError instance', async () => {
    const error = new SSLError(sslErrorMockData, {});

    return expect(error).toBeInstanceOf(SSLError);
  });

  test('SSL Error should have message', async () => {
    const error = new SSLError(sslErrorMockData, {});

    return expect(error)
      .toHaveProperty('message');
  });

  test('SSL Error should have code', async () => {
    const error = new SSLError(sslErrorMockData, {});

    return expect(error)
      .toHaveProperty('code');
  });

  test('SSL Error should have status 401', async () => {
    const error = new SSLError(sslErrorMockData, {});

    return expect(error.code).toBe('401');
  });

  test('SSL Response should should have valid data', async () => {
    const error = new SSLError(sslErrorMockData, {});

    const jsonResponse = JSON.parse(sslErrorMockData.bodyString);

    return expect(error.message)
      .toBe(jsonResponse.message);
  });
});
