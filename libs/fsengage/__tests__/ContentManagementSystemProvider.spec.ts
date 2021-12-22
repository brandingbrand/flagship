/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore using ts-sinon instead of sinon causes a conflict between @types/node and @types/react
import { assert, stub } from 'sinon';

import CoreContentManagementSystemProvider from '../src/modules/cms/providers/core/CoreContentManagementSystemProvider';
import { ContentManagementSystemContext } from '../src/modules/cms/providers/ContentManagementSystemProvider';
import { Dictionary } from '@brandingbrand/fsfoundation';

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

  describe('Core', () => {
    test('Slot Content', (done) => {
      proxy = stub(CoreContentManagementSystemProvider.prototype as any, 'pullContent').callsFake(
        async () => {
          return Promise.resolve(fixture.payload);
        }
      );

      const context: ContentManagementSystemContext = {
        // @ts-ignore Partial object
        locator: {
          getCurrentLocation: async () => {
            return Promise.resolve(fixture.location.inside);
          },
        },
      };

      core
        .contentForSlot('Homepage', 'Hero-Carousel', undefined, context)
        .then((content: Dictionary) => {
          const expectedContent = fixture.payload.data.Homepage['Hero-Carousel'];

          // Removes the instance with invalid date.
          expectedContent.instances.pop();

          expect(content).toEqual(expectedContent);

          assert.calledOnce(
            // @ts-ignore use of private method
            CoreContentManagementSystemProvider.prototype.pullContent
          );

          return done();
        })
        .catch(done);
    });

    test('Slot Content Missing', (done) => {
      proxy = stub(CoreContentManagementSystemProvider.prototype as any, 'pullContent').callsFake(
        async () => {
          return Promise.resolve(fixture2);
        }
      );

      const context: ContentManagementSystemContext = {
        // @ts-ignore Partial object
        locator: {
          getCurrentLocation: async () => {
            return Promise.resolve(fixture.location.inside);
          },
        },
      };

      core
        .contentForSlot('home', 'header-text', undefined, context)
        .then((content: Dictionary) => {
          expect(content).toBeNull();

          assert.calledOnce(
            // @ts-ignore use of private method
            CoreContentManagementSystemProvider.prototype.pullContent
          );

          return done();
        })
        .catch(done);
    });
  });
});
