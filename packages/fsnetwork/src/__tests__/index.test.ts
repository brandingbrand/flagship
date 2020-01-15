import FSNetwork from '../index';
import { SSLPinningInstance } from '../lib/sll';
import { SSLError } from '../lib/sll/SSLError';
import { SSLResponse } from '../lib/sll/SSLResponse';

const sslResponseMockData = {
  bodyString: '{"testString": "test", "testObject": {"1": "1", "2": [1, 2]}}',
  url: '/',
  headers: {
    'Content-Type': 'Application/json'
  },
  status: 200,
  json: () => new Promise<{[p: string]: any}>(res => res({ testPromise: true })),
  text: () => new Promise<string>(res => res('testText'))
};

const sslErrorMockData = {
  bodyString: '{"message": "Invalid token", "statusText": "Unauthorized"}',
  url: '/',
  headers: {
    'Content-Type': 'Application/json'
  },
  status: 401,
  json: () => new Promise<{[p: string]: any}>(res => res({ testPromise: true })),
  text: () => new Promise<string>(res => res('testText'))
};

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

  test('method HEAD should not be allowed with SSL pinning', async () => {
    const network = new FSNetwork({
      baseURL: 'https://github.com',
      pinnedCertificates: [{
        baseUrl: 'https://github.com',
        path: 'github.cer'
      }]
    });

    expect(() => network.head('/').catch()).toThrowError(
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

    expect(() => network.patch('/').catch()).toThrowError(
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

    expect(network).toBeInstanceOf(SSLPinningInstance);
  });

  test('create SSLResponse instance', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    expect(response).toBeInstanceOf(SSLResponse);
  });

  // SSL Response
  test('SSL Response should have all required properties', async () => {
    const response = new SSLResponse(sslResponseMockData, {});
    expect(response)
      .toHaveProperty('data');

    expect(response)
      .toHaveProperty('status');
  });

  test('SSL Response should have status 200', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    expect(response.status).toBe(200);
  });

  test('SSL Response should should have valid data', async () => {
    const response = new SSLResponse(sslResponseMockData, {});

    const jsonResponse = JSON.parse(sslResponseMockData.bodyString);

    expect(response.data)
      .toMatchObject(jsonResponse);
  });

  // SSLError
  test('create SSLError instance', async () => {
    const error = new SSLError(sslErrorMockData, {});

    expect(error).toBeInstanceOf(SSLError);
  });

  test('SSL Error should have all required properties', async () => {
    const error = new SSLError(sslErrorMockData, {});
    expect(error)
      .toHaveProperty('message');

    expect(error)
      .toHaveProperty('code');
  });

  test('SSL Error should have status 401', async () => {
    const error = new SSLError(sslErrorMockData, {});

    expect(error.code).toBe('401');
  });

  test('SSL Response should should have valid data', async () => {
    const error = new SSLError(sslErrorMockData, {});

    const jsonResponse = JSON.parse(sslErrorMockData.bodyString);

    expect(error.message)
      .toBe(jsonResponse.message);
  });
});
