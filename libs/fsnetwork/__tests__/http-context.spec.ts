import { FSNetwork } from '../src';
import { HttpContext, HttpContextToken } from '../src/http-context';

describe('HttpContext', () => {
  const defaultContextUnsetToken = new HttpContextToken('unsetToken', true);
  const defaultContextSetToken = new HttpContextToken('setToken', false);

  let networkContext: HttpContext;
  let network: FSNetwork;

  beforeEach(() => {
    networkContext = new HttpContext();
    networkContext.set(defaultContextSetToken, true);
    network = new FSNetwork({ context: networkContext });
  });

  describe('network level context', () => {
    it('should add context to the request config', async () => {
      const result = await network.get('https://brandingbrand.com');

      expect(result.config.context).toBeInstanceOf(HttpContext);
    });

    it('should have the default value for unset tokens', async () => {
      const result = await network.get('https://brandingbrand.com');
      const isTokenValueSet = result.config.context.get(defaultContextUnsetToken);

      expect(isTokenValueSet).toBe(true);
    });

    it('should have the network level context value for set tokens', async () => {
      const result = await network.get('https://brandingbrand.com');
      const isTokenValueSet = result.config.context.get(defaultContextSetToken);

      expect(isTokenValueSet).toBe(true);
    });
  });

  describe('request level context', () => {
    it('should extend the network level config', async () => {
      const context = new HttpContext();
      const result = await network.get('https://brandingbrand.com', { context });
      const isTokenValueSet = result.config.context.get(defaultContextSetToken);

      expect(isTokenValueSet).toBe(true);
    });

    it('should set values for that request', async () => {
      const context = new HttpContext();
      const requestToken = new HttpContextToken('requestToken', false);
      context.set(requestToken, true);

      const result = await network.get('https://brandingbrand.com', { context });
      const isTokenValueSet = result.config.context.get(requestToken);

      expect(isTokenValueSet).toBe(true);
    });

    it('should override network level values', async () => {
      const context = new HttpContext();
      context.set(defaultContextSetToken, false);

      const result = await network.get('https://brandingbrand.com', { context });
      const isTokenValueSet = result.config.context.get(defaultContextSetToken);

      expect(isTokenValueSet).toBe(false);
    });

    it('should not modify the network level context', async () => {
      const context = new HttpContext();
      context.set(defaultContextSetToken, false);

      await network.get('https://brandingbrand.com', { context });

      const isNetworkContextSet = networkContext.get(defaultContextSetToken);

      expect(isNetworkContextSet).toBe(true);
    });
  });
});
