import targetInstancesByTimeZone from '../src/modules/cms/providers/core/targets/targetInstancesByTimeZone';

const fixture = require('./ContentManagementSystem.fixture.json');

describe('Core Content Management System Provider - TimeZone Target', () => {
  it('valid Location', (done) => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[0];
    const targets = fixture.payload.data._Targets;

    targets[1].Timezone = {
      timezone: String(new Date().getTimezoneOffset()),
    };

    const result = targetInstancesByTimeZone(instances, targets);

    expect(result).toBe(true);

    return done();
  });

  it('invalid Location', (done) => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[1];
    const targets = fixture.payload.data._Targets;

    targets[1].Timezone = {
      timezone: String(new Date().getTimezoneOffset() + 100),
    };

    const result = targetInstancesByTimeZone(instances, targets);

    expect(result).toBe(false);

    return done();
  });
});
