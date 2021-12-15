import targetInstancesByTimeOfDay from '../src/modules/cms/providers/core/targets/targetInstancesByTimeOfDay';

const fixture = require('./ContentManagementSystem.fixture.json');

describe('Core Content Management System Provider - TimeOfDay Target', () => {
  test('Valid Location', done => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[0];
    const targets = fixture.payload.data._Targets;

    const currentDate = new Date();
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    let endHour = hour + 1;
    let endMinutes = minutes + 1;

    if (59 === minutes) {
      endMinutes = 0;

      if (23 === hour) {
        endHour = 0;
      }
    }

    targets[1]['Time-of-Day'] = {
      time_start: hour + ':' + minutes,
      time_end: endHour + ':' + endMinutes
    };

    const result = targetInstancesByTimeOfDay(instances, targets);

    expect(result).toEqual(true);

    return done();
  });

  test('Invalid Location', done => {
    const instances = fixture.payload.data.Homepage['Hero-Carousel'].instances[1];
    const targets = fixture.payload.data._Targets;

    const currentDate = new Date();
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const startMinutes = minutes < 30 ? 40 : 10;
    const endMinutes = minutes < 30 ? 50 : 20;

    targets[1]['Time-of-Day'] = {
      time_start: hour + ':' + startMinutes,
      time_end: hour + ':' + endMinutes
    };

    const result = targetInstancesByTimeOfDay(instances, targets);

    expect(result).toEqual(false);

    return done();
  });
});
