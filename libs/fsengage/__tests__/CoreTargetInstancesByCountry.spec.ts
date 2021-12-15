import targetInstancesByCountry from '../src/modules/cms/providers/core/targets/targetInstancesByCountry';

const fixture = require('./ContentManagementSystem.fixture.json');

describe('Core Content Management System Provider - Country Target', () => {
  test('Valid Location', done => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[0];
    const targets = fixture.payload.data._Targets;
    const location = fixture.location.inside;
    const result = targetInstancesByCountry(instances, targets, location);

    expect(result).toEqual(true);

    return done();
  });

  test('Invalid Location', done => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[0];
    const targets = fixture.payload.data._Targets;
    const location = fixture.location.outside;
    const result = targetInstancesByCountry(instances, targets, location);

    expect(result).toEqual(false);

    return done();
  });
});
