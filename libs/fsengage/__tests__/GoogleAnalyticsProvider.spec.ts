import { Component } from 'react';

import { assert, stub } from 'sinon';

import Analytics from '../src/modules/analytics/Analytics';
import GoogleAnalyticsProvider from '../src/modules/analytics/providers/google/GoogleAnalyticsProvider';

const fixture = require('./GoogleAnalyticsProvider.fixture.json');

describe('Analytics', () => {
  let analytics: Analytics;
  let stubbed: any;

  beforeAll((done) => {
    const { commonConfiguration } = fixture;
    const { configuration } = fixture;
    const providers = [new GoogleAnalyticsProvider(commonConfiguration, configuration)];

    analytics = new Analytics(providers);
    setTimeout(done, 0);
  });

  afterEach((done) => {
    stubbed.restore();

    return done();
  });

  describe('events', () => {
    describe('commerce', () => {
      // Contact

      it('contact Call & Component', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.contact.call.response.default);
          }
        );

        const component = new Component({});
        analytics.contact.call(component, fixture.contact.call.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('contact Call & Component Property', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.contact.call.response.custom);
          }
        );

        // @ts-expect-error we add an .analytics property to components
        Component.prototype.analytics = fixture.contact.call.module;

        const component = new Component({});
        analytics.contact.call(component, fixture.contact.call.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('contact Call & Component Custom', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.contact.call.response.custom);
          }
        );

        analytics.contact.call(
          fixture.contact.call.module.contact.call,
          fixture.contact.call.request
        );

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('contact Email & Component', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.contact.email.response.default);
          }
        );

        const component = new Component({});
        analytics.contact.email(component, fixture.contact.email.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('contact Email & Component Property', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.contact.email.response.custom);
          }
        );

        // @ts-expect-error we add an .analytics property to components
        Component.prototype.analytics = fixture.contact.email.module;

        const component = new Component({});
        analytics.contact.email(component, fixture.contact.email.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('contact Email & Component Custom', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.contact.email.response.custom);
          }
        );

        analytics.contact.email(
          fixture.contact.email.module.contact.email,
          fixture.contact.email.request
        );

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      // Click

      it('click Generic & Component', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.click.generic.response.default);
          }
        );

        const component = new Component({});
        analytics.click.generic(component, fixture.click.generic.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('click Generic & Component Property', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.click.generic.response.custom);
          }
        );

        // @ts-expect-error we add an .analytics property to components
        Component.prototype.analytics = fixture.click.generic.module;

        const component = new Component({});
        analytics.click.generic(component, fixture.click.generic.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('click Generic & Component Custom', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.click.generic.response.custom);
          }
        );

        analytics.click.generic(
          fixture.click.generic.module.click.generic,
          fixture.click.generic.request
        );

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      // Location

      it('location Directions & Component', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.location.directions.response.default);
          }
        );

        const component = new Component({});
        analytics.location.directions(component, fixture.location.directions.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('location Directions & Component Property', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.location.directions.response.custom);
          }
        );

        // @ts-expect-error we add an .analytics property to components
        Component.prototype.analytics = fixture.location.directions.module;

        const component = new Component({});
        analytics.location.directions(component, fixture.location.directions.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('location Directions & Component Custom', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.location.directions.response.custom);
          }
        );

        analytics.location.directions(
          fixture.location.directions.module.location.directions,
          fixture.location.directions.request
        );

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      // Search

      it('search Generic & Component', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.search.generic.response.default);
          }
        );

        const component = new Component({});
        analytics.search.generic(component, fixture.search.generic.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('search Generic & Component Property', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.search.generic.response.custom);
          }
        );

        // @ts-expect-error we add an .analytics property to components
        Component.prototype.analytics = fixture.search.generic.module;

        const component = new Component({});
        analytics.search.generic(component, fixture.search.generic.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('search Generic & Component Custom', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.search.generic.response.custom);
          }
        );

        analytics.search.generic(
          fixture.search.generic.module.search.generic,
          fixture.search.generic.request
        );

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      // Impression

      it('impression Generic & Component', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.impression.generic.response.default);
          }
        );

        const component = new Component({});
        analytics.impression.generic(component, fixture.impression.generic.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('impression Generic & Component Property', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.impression.generic.response.custom);
          }
        );

        // @ts-expect-error we add an .analytics property to components
        Component.prototype.analytics = fixture.impression.generic.module;

        const component = new Component({});
        analytics.impression.generic(component, fixture.impression.generic.request);

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('impression Generic & Component Custom', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.impression.generic.response.custom);
          }
        );

        analytics.impression.generic(
          fixture.impression.generic.module.impression.generic,
          fixture.impression.generic.request
        );

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });
    });

    describe('app Lifecycle', () => {
      it('active App', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.lifecycle.active.response);
          }
        );

        analytics.lifecycle.active();

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('background App', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.lifecycle.background.response);
          }
        );

        analytics.lifecycle.background();

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('close App', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.lifecycle.close.response);
          }
        );

        analytics.lifecycle.close();

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('create App', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.lifecycle.create.response);
          }
        );

        analytics.lifecycle.create();

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('inactive App', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.lifecycle.inactive.response);
          }
        );

        analytics.lifecycle.inactive();

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('start App', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.lifecycle.start.response);
          }
        );

        analytics.lifecycle.start();

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });

      it('suspend App', (done) => {
        // @ts-expect-error ts-sinon does not define these types
        stubbed = stub(GoogleAnalyticsProvider.prototype, '_sendEvent').callsFake(
          (properties: unknown) => {
            expect(properties).toEqual(fixture.lifecycle.suspend.response);
          }
        );

        analytics.lifecycle.suspend();

        assert.calledOnce(
          // @ts-expect-error accessing private function
          GoogleAnalyticsProvider.prototype._sendEvent
        );

        return done();
      });
    });
  });
});
