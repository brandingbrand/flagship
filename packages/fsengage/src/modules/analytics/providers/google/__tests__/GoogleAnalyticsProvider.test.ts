// @ts-ignore using ts-sinon instead of sinon causes a conflict between @types/node and @types/react
import { assert, stub } from 'sinon'; // tslint:disable-line:no-implicit-dependencies
import { Component } from 'react';

import Analytics from '../../../Analytics';
import GoogleAnalyticsProvider from '../GoogleAnalyticsProvider';

const fixture = require('./GoogleAnalyticsProvider.fixture.json');

describe('Analytics', () => {
  let analytics: Analytics;
  let stubbed: any;

  beforeAll(done => {
    const commonConfiguration = fixture.commonConfiguration;
    const configuration = fixture.configuration;
    const providers = [new GoogleAnalyticsProvider(commonConfiguration, configuration)];

    analytics = new Analytics(providers);
    setTimeout(done, 0);
  });

  afterEach(done => {
    stubbed.restore();

    return done();
  });

  describe('Events', () => {
    describe('Commerce', () => {
      // Contact

      test('Contact Call & Component', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.contact.call.response.default);
          });

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.call(component, fixture.contact.call.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Contact Call & Component Property', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.contact.call.response.custom);
          });

        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.contact.call.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.call(component, fixture.contact.call.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Contact Call & Component Custom', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.contact.call.response.custom);
          });

        analytics.contact.call(
          fixture.contact.call.module.contact.call,
          fixture.contact.call.request
        );

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Contact Email & Component', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.contact.email.response.default);
          });

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.email(component, fixture.contact.email.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Contact Email & Component Property', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.contact.email.response.custom);
          });

        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.contact.email.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.email(component, fixture.contact.email.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Contact Email & Component Custom', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.contact.email.response.custom);
          });

        analytics.contact.email(
          fixture.contact.email.module.contact.email,
          fixture.contact.email.request
        );

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      // Click

      test('Click Generic & Component', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.click.generic.response.default);
          });

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.click.generic(component, fixture.click.generic.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Click Generic & Component Property', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.click.generic.response.custom);
          });

        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.click.generic.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.click.generic(component, fixture.click.generic.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Click Generic & Component Custom', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.click.generic.response.custom);
          });

        analytics.click.generic(
          fixture.click.generic.module.click.generic,
          fixture.click.generic.request
        );

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      // Location

      test('Location Directions & Component', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.location.directions.response.default);
          });

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.location.directions(component, fixture.location.directions.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Location Directions & Component Property', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.location.directions.response.custom);
          });

        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.location.directions.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.location.directions(component, fixture.location.directions.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Location Directions & Component Custom', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.location.directions.response.custom);
          });

        analytics.location.directions(
          fixture.location.directions.module.location.directions,
          fixture.location.directions.request
        );

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      // Search

      test('Search Generic & Component', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.search.generic.response.default);
          });

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.search.generic(component, fixture.search.generic.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Search Generic & Component Property', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.search.generic.response.custom);
          });

        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.search.generic.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.search.generic(component, fixture.search.generic.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Search Generic & Component Custom', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.search.generic.response.custom);
          });

        analytics.search.generic(
          fixture.search.generic.module.search.generic,
          fixture.search.generic.request
        );

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      // Impression

      test('Impression Generic & Component', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.impression.generic.response.default);
          });

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.impression.generic(component, fixture.impression.generic.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Impression Generic & Component Property', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.impression.generic.response.custom);
          });

        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.impression.generic.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.impression.generic(component, fixture.impression.generic.request);

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Impression Generic & Component Custom', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.impression.generic.response.custom);
          });

        analytics.impression.generic(
          fixture.impression.generic.module.impression.generic,
          fixture.impression.generic.request
        );

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });
    });

    describe('App Lifecycle', () => {
      test('Active App', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.lifecycle.active.response);
          });

        analytics.lifecycle.active();

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Background App', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.lifecycle.background.response);
          });

        analytics.lifecycle.background();

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Close App', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.lifecycle.close.response);
          });

        analytics.lifecycle.close();

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Create App', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.lifecycle.create.response);
          });

        analytics.lifecycle.create();

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Inactive App', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.lifecycle.inactive.response);
          });

        analytics.lifecycle.inactive();

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Start App', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.lifecycle.start.response);
          });

        analytics.lifecycle.start();

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });

      test('Suspend App', done => {
        // @ts-ignore ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent')
          .callsFake((properties: any) => {
            expect(properties).toEqual(fixture.lifecycle.suspend.response);
          });

        analytics.lifecycle.suspend();

        assert.calledOnce(
          // @ts-ignore accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent  // tslint:disable-line no-unbound-method
        );

        return done();
      });
    });
  });
});
