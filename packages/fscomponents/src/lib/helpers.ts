/* tslint:disable */
import { Distance, DistanceUnit } from '@brandingbrand/fsfoundation';
import { Address, Hour } from '../types/Store';

/**
 *
 * format hours into human readable string
 *
 * @param hours array of hour object that defined in storc2
 * @param currentDate date that we want to know if open or not, default to currect date
 * @param format format type: "1", "2" or "3", default is "1"
 */
export function formatHours(
  hours: Hour[],
  currentDate?: Date,
  format?: string
) {
  const date = currentDate || new Date();
  const hourOfDay = hours.find(h => h.dayOfWeek === date.getDay());
  if (!hourOfDay) return ``;

  switch (format) {
    case '1':
      return `Open ${hourOfDay.open} to ${hourOfDay.close}`;
    case '2':
      return `Open until ${hourOfDay.close}`;
    case '3':
      const isOpen = checkIfOpen(date, hourOfDay.open, hourOfDay.close);
      return `${isOpen ? 'Open' : 'Closed'} | Closes ${hourOfDay.close}`;
    default:
      return `Open ${hourOfDay.open} to ${hourOfDay.close}`;
  }
}

function checkIfOpen(currentDate: Date, open: string, close: string) {
  const _open = normalizedHourString(open);
  const _close = normalizedHourString(close);
  const _current = currentDate.getHours() * 100 + currentDate.getMinutes();

  return _current >= _open && _current <= _close;
}

function normalizedHourString(hour: string): number {
  const isAM = hour.indexOf('AM') > -1;
  let hourNumber = 0;

  if (hour.indexOf(':') > -1) {
    const split = hour.match(/(\d+):(\d+)/);
    if (split && split.length > 2) {
      hourNumber = +split[1] * 100 + +split[2];
    }
  } else {
    const split = hour.match(/(\d+)/);
    if (split && split.length > 1) {
      hourNumber = +split[1] * 100;
    }
  }

  if (!isAM) {
    hourNumber += 1200;
  }

  return hourNumber;
}

/**
 *
 * @param distance Distance object that we want to format
 * @param format format type: "short" or "full", default is "short"
 */
export function formatDistance(distance: Distance, format?: string) {
  let unit = 'mi';

  if (distance.unit === DistanceUnit.Mile) {
    if (format === 'full') {
      if (distance.value === 1) {
        unit = 'mile';
      } else {
        unit = 'miles';
      }
    } else {
      unit = 'mi';
    }
  } else {
    if (format === 'full') {
      if (distance.value === 1) {
        unit = 'kilometer';
      } else {
        unit = 'kilometers';
      }
    } else {
      unit = 'km';
    }
  }
  return `${distance.value} ${unit}`;
}

/**
 *
 * format address into human readable string
 *
 * @param address address object that defined in storc2
 */
export function formatAddress(address: Address) {
  return address.address1;
}

/**
 * scroll element to a position, for Web use Only
 *
 * @param element dom element
 * @param target number of position x
 * @param duration number of duration in ms
 */
export function animatedScrollTo(element: Element, target: number, duration: number) {
  target = Math.round(target);
  duration = Math.round(duration);
  if (duration < 0) {
    return Promise.reject('bad duration');
  }
  if (duration === 0) {
    element.scrollLeft = target;
    return Promise.resolve();
  }

  let start_time = Date.now();
  let end_time = start_time + duration;

  let start_top = element.scrollLeft;
  let distance = target - start_top;

  // based on http://en.wikipedia.org/wiki/Smoothstep
  let smooth_step = function(start: number, end: number, point: number) {
    if (point <= start) {
      return 0;
    }
    if (point >= end) {
      return 1;
    }
    let x = (point - start) / (end - start);
    return x * x * (3 - 2 * x);
  };

  return new Promise(function(resolve, reject) {
    let previous_top = element.scrollLeft;
    let scroll_frame = function() {
      if (element.scrollLeft != previous_top) {
        return;
      }

      let now = Date.now();
      let point = smooth_step(start_time, end_time, now);
      let frameTop = Math.round(start_top + distance * point);
      element.scrollLeft = frameTop;

      if (now >= end_time) {
        resolve();
        return;
      }

      if (
        element.scrollLeft === previous_top &&
        element.scrollLeft !== frameTop
      ) {
        resolve();
        return;
      }
      previous_top = element.scrollLeft;

      requestAnimationFrame(scroll_frame);
    };

    requestAnimationFrame(scroll_frame);
  });
}
