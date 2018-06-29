// @ts-ignore using ts-sinon instead of sinon causes a conflict between @types/node and @types/react
import { assert, stub } from 'sinon'; // tslint:disable-line:no-implicit-dependencies

import CoreContentManagementSystemProvider from '../CoreContentManagementSystemProvider';
import ContentManagementSystemContext from '../../ContentManagementSystemProvider';

const fixture = require('./ContentManagementSystem.fixture.json');
const fixture2 = require('./ContentManagementSystem2.fixture.json');

describe('Content Management System Provider', () => {
  let core: CoreContentManagementSystemProvider;
  let proxy: any;

  beforeAll(done => {
    // IMPORTANT: this configuration is a placeholder to satisfy the constructor; no requests are
    // actually being made to the CMS. The stub on CoreContentManagementSystemProvider.pullContent
    // returns test JSON, so these tests are only verifying the post-retrieval data processing of
    // the CMSProvider.
    const configuration = {
      propertyId: '443',
      environment: 1
    };

    core = new CoreContentManagementSystemProvider(configuration);

    return done();
  });

  afterEach(done => {
    proxy.restore();

    return done();
  });

  describe('Core', () => {
    test('Slot Content', async done => {
      proxy = stub(CoreContentManagementSystemProvider.prototype, 'pullContent')
        .callsFake(async () => {
          return Promise.resolve(fixture.payload);
        });

      const context = {
        locator: {
          getCurrentLocation: async () => {
            return Promise.resolve(fixture.location.inside);
          }
        }
      };

      return core.contentForSlot(
        'Homepage',
        'Hero-Carousel',
        undefined,
        context as ContentManagementSystemContext
      ).then(content => {
        const expectedContent = fixture.payload.data.Homepage['Hero-Carousel'];

        // Removes the instance with invalid date.
        expectedContent.instances.pop();

        expect(content).toEqual(expectedContent);

        assert.calledOnce(
          // @ts-ignore use of private method
          // tslint:disable-next-line no-unbound-method
          CoreContentManagementSystemProvider.prototype.pullContent
        );

        return done();
      });
    });

    test('Slot Content Missing', async done => {
      proxy = stub(CoreContentManagementSystemProvider.prototype, 'pullContent')
        .callsFake(async () => {
          return Promise.resolve(fixture2);
        });

      const context = {
        locator: {
          getCurrentLocation: async () => {
            return Promise.resolve(fixture.location.inside);
          }
        }
      };

      return core.contentForSlot(
        'home',
        'header-text',
        undefined,
        context as ContentManagementSystemContext
      ).then(content => {
        expect(content).toBeNull();

        assert.calledOnce(
          // @ts-ignore use of private method
          // tslint:disable-next-line no-unbound-method
          CoreContentManagementSystemProvider.prototype.pullContent
        );

        return done();
      });
    });
  });
});
