import { assert, stub } from 'sinon';

import type { ContentManagementSystemContext } from '../src/modules/cms/providers/ContentManagementSystemProvider';
import CoreContentManagementSystemProvider from '../src/modules/cms/providers/core/CoreContentManagementSystemProvider';

const fixture = require('./ContentManagementSystem.fixture.json');
const fixture2 = require('./ContentManagementSystem2.fixture.json');

describe('Content Management System Provider', () => {
  let core: CoreContentManagementSystemProvider;
  let proxy: any;

  beforeAll((done) => {
    // IMPORTANT: this configuration is a placeholder to satisfy the constructor; no requests are
    // actually being made to the CMS. The stub on CoreContentManagementSystemProvider.pullContent
    // returns test JSON, so these tests are only verifying the post-retrieval data processing of
    // the CMSProvider.
    const configuration = {
      propertyId: '443',
      environment: 1,
    };

    core = new CoreContentManagementSystemProvider(configuration);

    return done();
  });

  afterEach((done) => {
    proxy.restore();

    return done();
  });

  describe('core', () => {
    it('slot Content', (done) => {
      proxy = stub(CoreContentManagementSystemProvider.prototype as any, 'pullContent').callsFake(
        async () => fixture.payload
      );

      const context: ContentManagementSystemContext = {
        // @ts-expect-error Partial object
        locator: {
          getCurrentLocation: async () => fixture.location.inside,
        },
      };

      core
        .contentForSlot('Homepage', 'Hero-Carousel', undefined, context)
        .then((content: Record<string, unknown>) => {
          const expectedContent = fixture.payload.data.Homepage['Hero-Carousel'];

          // Removes the instance with invalid date.
          expectedContent.instances.pop();

          expect(content).toEqual(expectedContent);

          assert.calledOnce(
            // @ts-expect-error use of private method
            CoreContentManagementSystemProvider.prototype.pullContent
          );

          return done();
        })
        .catch(done);
    });

    it('slot Content Missing', (done) => {
      proxy = stub(CoreContentManagementSystemProvider.prototype as any, 'pullContent').callsFake(
        async () => fixture2
      );

      const context: ContentManagementSystemContext = {
        // @ts-expect-error Partial object
        locator: {
          getCurrentLocation: async () => fixture.location.inside,
        },
      };

      core
        .contentForSlot('home', 'header-text', undefined, context)
        .then((content: Record<string, unknown>) => {
          expect(content).toBeNull();

          assert.calledOnce(
            // @ts-expect-error use of private method
            CoreContentManagementSystemProvider.prototype.pullContent
          );

          return done();
        })
        .catch(done);
    });
  });
});
