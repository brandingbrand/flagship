import { Injector } from '@brandingbrand/fslinker';

import { APP_INTERCEPTOR, FSNetwork } from '../src';

describe('app interceptors', () => {
  const network = new FSNetwork();

  beforeEach(() => {
    Injector.reset();
  });

  it('should run an interceptor through when making a request', async () => {
    const interceptorMock = jest.fn();

    Injector.provide({
      provide: APP_INTERCEPTOR,
      useValue: async (config, next) => {
        interceptorMock();
        return next(config);
      },
      many: true,
    });

    await network.get<unknown>('https://www.brandingbrand.com');

    expect(interceptorMock).toHaveBeenCalledTimes(1);
  });

  it('should call interceptors in the right order when making request', async () => {
    const interceptorMock = jest.fn();

    Injector.provide({
      provide: APP_INTERCEPTOR,
      useValue: async (config, next) => {
        interceptorMock(1);
        const response = await next(config);
        interceptorMock(6);
        return response;
      },
      many: true,
    });

    Injector.provide({
      provide: APP_INTERCEPTOR,
      useValue: async (config, next) => {
        interceptorMock(2);
        const response = await next(config);
        interceptorMock(5);
        return response;
      },
      many: true,
    });

    Injector.provide({
      provide: APP_INTERCEPTOR,
      useValue: async (config, next) => {
        interceptorMock(3);
        const response = await next(config);
        interceptorMock(4);
        return response;
      },
      many: true,
    });

    await network.get<unknown>('https://www.brandingbrand.com');

    expect(interceptorMock).toHaveBeenNthCalledWith(1, 1);
    expect(interceptorMock).toHaveBeenNthCalledWith(2, 2);
    expect(interceptorMock).toHaveBeenNthCalledWith(3, 3);
    expect(interceptorMock).toHaveBeenNthCalledWith(4, 4);
    expect(interceptorMock).toHaveBeenNthCalledWith(5, 5);
    // eslint-disable-next-line jest/max-expects -- 3 interceptors checking that they are called in the correct order
    expect(interceptorMock).toHaveBeenNthCalledWith(6, 6);
  });

  it('should pass results between interceptors', async () => {
    const interceptorMock = jest.fn();

    Injector.provide({
      provide: APP_INTERCEPTOR,
      useValue: async (config, next) => {
        config.headers = { ...config.headers, testing: '1' };
        const response = await next(config);
        interceptorMock(response);
        return { ...response, data: 1 };
      },
      many: true,
    });

    Injector.provide({
      provide: APP_INTERCEPTOR,
      useValue: async (config, next) => {
        interceptorMock(config.headers);
        const response = await next(config);
        return { ...response, data: 2 };
      },
      many: true,
    });

    const result = await network.get<unknown>('https://www.brandingbrand.com');

    expect(interceptorMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ testing: '1' }));
    expect(interceptorMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ data: 2 }));
    expect(result.data).toBe(1);
  });
});
