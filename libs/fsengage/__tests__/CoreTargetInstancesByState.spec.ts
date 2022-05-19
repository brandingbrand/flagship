import targetInstancesByState from '../src/modules/cms/providers/core/targets/targetInstancesByState';

const fixture = require('./ContentManagementSystem.fixture.json');

describe('Core Content Management System Provider - State Target', () => {
  it('valid Location', (done) => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[0];
    const targets = fixture.payload.data._Targets;
    const location = fixture.location.inside;
    const result = targetInstancesByState(instances, targets, location);

    expect(result).toBe(true);

    return done();
  });

  it('invalid Location', (done) => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[0];
    const targets = fixture.payload.data._Targets;
    const location = fixture.location.outside;
    const result = targetInstancesByState(instances, targets, location);

    expect(result).toBe(false);

    return done();
  });
});
