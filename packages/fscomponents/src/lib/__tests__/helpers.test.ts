import { formatHours } from '../helpers';

const hours = [
  {
    dayOfWeek: 1,
    date: null,
    open: '6:30 AM',
    close: '9 PM',
    serviceId: 316,
    id: 1408
  },
  {
    dayOfWeek: 2,
    date: null,
    open: '6:30 AM',
    close: '9 PM',
    serviceId: 316,
    id: 1409
  },
  {
    dayOfWeek: 3,
    date: null,
    open: '6:30 AM',
    close: '9 PM',
    serviceId: 316,
    id: 1410
  },
  {
    dayOfWeek: 4,
    date: null,
    open: '6:30 AM',
    close: '9 PM',
    serviceId: 316,
    id: 1411
  },
  {
    dayOfWeek: 6,
    date: null,
    open: '6:30 AM',
    close: '9 PM',
    serviceId: 316,
    id: 1412
  },
  {
    dayOfWeek: 0,
    date: null,
    open: '6:30 AM',
    close: '7 PM',
    serviceId: 316,
    id: 1413
  },
  {
    dayOfWeek: 5,
    date: null,
    open: '6:30 AM',
    close: '9 PM',
    serviceId: 316,
    id: 1415
  }
];

describe('formatHours', () => {
  const currentDate = new Date('Tue Jul 25 2017 11:46:32 GMT-0400 (EDT)');
  const beforeOpenDate = new Date('Tue Jul 25 2017 1:46:32 GMT-0400 (EDT)');
  const afterCloesdDate = new Date('Tue Jul 25 2017 22:46:32 GMT-0400 (EDT)');

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
    expect(formatHours(hours, afterCloesdDate, '3')).toBe(
      'Closed | Closes 9 PM'
    );
  });

  test('hour not exist for the day', () => {
    const housWithoutTues = hours.slice(2);
    expect(formatHours(housWithoutTues, currentDate, '3')).toBe('');
  });
});
