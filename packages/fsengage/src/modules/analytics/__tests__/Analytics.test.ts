// @ts-ignore using ts-sinon instead of sinon causes a conflict between @types/node and @types/react
// tslint:disable:no-unbound-method
// tslint:disable-next-line:no-implicit-dependencies
import { assert, resetHistory, stub } from 'sinon';
import { Component } from 'react';

import Analytics from '../Analytics';
import { MockProvider } from './MockProvider';
import { AnalyticsProvider } from '../AnalyticsProvider';

const fixture = require('./AnalyticsProvider.fixture.json');

describe('Analytics', () => {
  let analytics: Analytics;
  let stubProvider: AnalyticsProvider;

  beforeAll(done => {
    stubProvider = stub(new MockProvider(fixture.commonConfiguration));
    analytics = new Analytics([stubProvider]);

    return done();
  });

  afterEach(done => {
    resetHistory();
    return done();
  });

  describe('Events', () => {
    describe('Contact - Call', () => {
      test('Contact Call & Component', done => {
        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.call(component, fixture.contact.call.request);
        assert.calledOnce(stubProvider.contactCall);
        assert.calledWithExactly(stubProvider.contactCall, fixture.contact.call.response.default);

        return done();
      });

      test('Contact Call & Component Property', done => {
        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.contact.call.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.call(component, fixture.contact.call.request);
        assert.calledOnce(stubProvider.contactCall);
        assert.calledWithExactly(stubProvider.contactCall, fixture.contact.call.response.custom);

        return done();
      });

      test('Contact Call & Component Custom', done => {
        analytics.contact.call(
          fixture.contact.call.module.contact.call,
          fixture.contact.call.request
        );

        assert.calledOnce(stubProvider.contactCall);
        assert.calledWithExactly(stubProvider.contactCall, fixture.contact.call.response.custom);

        return done();
      });
    });

    describe('Contact - Email', () => {
      test('Contact Email & Component', done => {
        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.email(component, fixture.contact.email.request);

        assert.calledOnce(stubProvider.contactEmail);
        assert.calledWithExactly(stubProvider.contactEmail, fixture.contact.email.response.default);

        return done();
      });

      test('Contact Email & Component Property', done => {
        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.contact.email.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.contact.email(component, fixture.contact.email.request);

        assert.calledOnce(stubProvider.contactEmail);
        assert.calledWithExactly(stubProvider.contactEmail, fixture.contact.email.response.custom);

        return done();
      });

      test('Contact Email & Component Custom', done => {
        analytics.contact.email(
          fixture.contact.email.module.contact.email,
          fixture.contact.email.request
        );

        assert.calledOnce(stubProvider.contactEmail);
        assert.calledWithExactly(stubProvider.contactEmail, fixture.contact.email.response.custom);

        return done();
      });
    });

    describe('Click - Generic', () => {
      test('Click Generic & Component', done => {
        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.click.generic(component, fixture.click.generic.request);

        assert.calledOnce(stubProvider.clickGeneric);
        assert.calledWithExactly(stubProvider.clickGeneric, fixture.click.generic.response.default);

        return done();
      });

      test('Click Generic & Component Property', done => {
        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.click.generic.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.click.generic(component, fixture.click.generic.request);

        assert.calledOnce(stubProvider.clickGeneric);
        assert.calledWithExactly(stubProvider.clickGeneric, fixture.click.generic.response.custom);

        return done();
      });

      test('Click Generic & Component Custom', done => {
        analytics.click.generic(
          fixture.click.generic.module.click.generic,
          fixture.click.generic.request
        );

        assert.calledOnce(stubProvider.clickGeneric);
        assert.calledWithExactly(stubProvider.clickGeneric, fixture.click.generic.response.custom);

        return done();
      });
    });

    describe('Location - Directions', () => {
      test('Location Directions & Component', done => {
        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.location.directions(component, fixture.location.directions.request);

        assert.calledOnce(stubProvider.locationDirections);
        assert.calledWithExactly(
          stubProvider.locationDirections,
          fixture.location.directions.response.default
        );

        return done();
      });

      test('Location Directions & Component Property', done => {
        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.location.directions.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.location.directions(component, fixture.location.directions.request);

        assert.calledOnce(stubProvider.locationDirections);
        assert.calledWithExactly(
          stubProvider.locationDirections,
          fixture.location.directions.response.custom
        );

        return done();
      });

      test('Location Directions & Component Custom', done => {
        analytics.location.directions(
          fixture.location.directions.module.location.directions,
          fixture.location.directions.request
        );

        assert.calledOnce(stubProvider.locationDirections);
        assert.calledWithExactly(
          stubProvider.locationDirections,
          fixture.location.directions.response.custom
        );

        return done();
      });
    });

    describe('Search - Generic', () => {
      test('Search Generic & Component', done => {
        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.search.generic(component, fixture.search.generic.request);

        assert.calledOnce(stubProvider.searchGeneric);
        assert.calledWithExactly(
          stubProvider.searchGeneric,
          fixture.search.generic.response.default
        );

        return done();
      });

      test('Search Generic & Component Property', done => {
        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.search.generic.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.search.generic(component, fixture.search.generic.request);

        assert.calledOnce(stubProvider.searchGeneric);
        assert.calledWithExactly(
          stubProvider.searchGeneric,
          fixture.search.generic.response.custom
        );

        return done();
      });

      test('Search Generic & Component Custom', done => {
        analytics.search.generic(
          fixture.search.generic.module.search.generic,
          fixture.search.generic.request
        );

        assert.calledOnce(stubProvider.searchGeneric);
        assert.calledWithExactly(
          stubProvider.searchGeneric,
          fixture.search.generic.response.custom
        );

        return done();
      });
    });

    describe('Impression - Generic', () => {
      test('Impression Generic & Component', done => {
        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.impression.generic(component, fixture.impression.generic.request);

        assert.calledOnce(stubProvider.impressionGeneric);
        assert.calledWithExactly(
          stubProvider.impressionGeneric,
          fixture.impression.generic.response.default
        );

        return done();
      });

      test('Impression Generic & Component Property', done => {
        // @ts-ignore we add an .analytics property to components
        Component.prototype.analytics = fixture.impression.generic.module;

        const component = new Component({}); // tslint:disable-line no-inferred-empty-object-type
        analytics.impression.generic(component, fixture.impression.generic.request);

        assert.calledOnce(stubProvider.impressionGeneric);
        assert.calledWithExactly(
          stubProvider.impressionGeneric,
          fixture.impression.generic.response.custom
        );

        return done();
      });

      test('Impression Generic & Component Custom', done => {
        analytics.impression.generic(
          fixture.impression.generic.module.impression.generic,
          fixture.impression.generic.request
        );

        assert.calledOnce(stubProvider.impressionGeneric);
        assert.calledWithExactly(
          stubProvider.impressionGeneric,
          fixture.impression.generic.response.custom
        );

        return done();
      });
    });

    describe('App Lifecycle', () => {
      test('Active App', done => {
        analytics.lifecycle.active();

        assert.calledOnce(stubProvider.lifecycle);
        assert.calledWithExactly(
          stubProvider.lifecycle,
          fixture.lifecycle.active.response
        );

        return done();
      });

      test('Background App', done => {
        analytics.lifecycle.background();

        assert.calledOnce(stubProvider.lifecycle);
        assert.calledWithExactly(
          stubProvider.lifecycle,
          fixture.lifecycle.background.response
        );

        return done();
      });

      test('Close App', done => {
        analytics.lifecycle.close();

        assert.calledOnce(stubProvider.lifecycle);
        assert.calledWithExactly(
          stubProvider.lifecycle,
          fixture.lifecycle.close.response
        );

        return done();
      });

      test('Create App', done => {
        analytics.lifecycle.create();

        assert.calledOnce(stubProvider.lifecycle);
        assert.calledWithExactly(
          stubProvider.lifecycle,
          fixture.lifecycle.create.response
        );

        return done();
      });

      test('Inactive App', done => {
        analytics.lifecycle.inactive();

        assert.calledOnce(stubProvider.lifecycle);
        assert.calledWithExactly(
          stubProvider.lifecycle,
          fixture.lifecycle.inactive.response
        );

        return done();
      });

      test('Start App', done => {
        analytics.lifecycle.start();

        assert.calledOnce(stubProvider.lifecycle);
        assert.calledWithExactly(
          stubProvider.lifecycle,
          fixture.lifecycle.start.response
        );

        return done();
      });

      test('Suspend App', done => {
        analytics.lifecycle.suspend();

        assert.calledOnce(stubProvider.lifecycle);
        assert.calledWithExactly(
          stubProvider.lifecycle,
          fixture.lifecycle.suspend.response
        );

        return done();
      });
    });
  });
});
