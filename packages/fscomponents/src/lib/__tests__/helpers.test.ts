import { formatHours } from '../helpers';

const hours = [
  {
    dayOfWeek: 1,
    open: '6:30 AM',
    close: '9 PM'
  },
  {
    dayOfWeek: 2,
    open: '6:30 AM',
    close: '9 PM'
  },
  {
    dayOfWeek: 3,
    open: '6:30 AM',
    close: '9 PM'
  },
  {
    dayOfWeek: 4,
    open: '6:30 AM',
    close: '9 PM'
  },
  {
    dayOfWeek: 6,
    open: '6:30 AM',
    close: '9 PM'
  },
  {
    dayOfWeek: 0,
    open: '6:30 AM',
    close: '7 PM'
  },
  {
    dayOfWeek: 5,
    open: '6:30 AM',
    close: '9 PM'
  }
];

describe('formatHours', () => {
  const currentDate = new Date('Tue Jul 25 2017 11:46:32');
  const beforeOpenDate = new Date('Tue Jul 25 2017 1:46:32');
  const afterCloseDate = new Date('Tue Jul 25 2017 22:46:32');

  test('default format', () => {
    expect(formatHours(hours, currentDate)).toBe('Open 6:30 AM to 9 PM');
  });

  test('format 2', () => {
    expect(formatHours(hours, currentDate, '2')).toBe('Open until 9 PM');
  });

  test('format 3', () => {
    expect(formatHours(hours, currentDate, '3')).toBe('Open | Closes 9 PM');
  });

  test('format 3 before open', () => {
    expect(formatHours(hours, beforeOpenDate, '3')).toBe(
      'Closed | Closes 9 PM'
    );
  });

  test('format 3 after closed', () => {
    expect(formatHours(hours, afterCloseDate, '3')).toBe(
      'Closed | Closes 9 PM'
    );
  });

  test('hour not exist for the day', () => {
    const housWithoutTues = hours.slice(2);
    expect(formatHours(housWithoutTues, currentDate, '3')).toBe('');
  });
});
