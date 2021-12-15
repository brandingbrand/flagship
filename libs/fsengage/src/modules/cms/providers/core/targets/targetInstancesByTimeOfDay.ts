const kTimeOfDayKey = 'Time-of-Day';

// eslint-disable-next-line complexity
export default function targetInstancesByTimeOfDay(
  instance: any,
  targets: { [index: string]: any }
): boolean {
  if (!instance) {
    return false;
  }

  if (!targets) {
    return true;
  }

  const currentDate = new Date();

  // Time operations are in milliseconds
  const currentLocalTime = currentDate.getTime() - (currentDate.getTimezoneOffset() * 60 * 1000);

  const instanceStartTime = instance.targets &&
                            instance.targets[kTimeOfDayKey] &&
                            instance.targets[kTimeOfDayKey].time_start;

  const instanceEndTime = instance.targets &&
                          instance.targets[kTimeOfDayKey] &&
                          instance.targets[kTimeOfDayKey].time_end;

  if (instanceStartTime && instanceEndTime) {
    const instanceStartHourAndMinute = instanceStartTime.split(':');
    const instanceEndHourAndMinute = instanceEndTime.split(':');


    const instanceLocalStartTime = new Date().setHours(
      instanceStartHourAndMinute[0], instanceStartHourAndMinute[1], 0, 0
    ) - (currentDate.getTimezoneOffset() * 60 * 1000);

    const instanceLocalEndTime = new Date().setHours(
      instanceEndHourAndMinute[0], instanceEndHourAndMinute[1], 0, 0
    ) - (currentDate.getTimezoneOffset() * 60 * 1000);

    if (currentLocalTime < instanceLocalStartTime || currentLocalTime > instanceLocalEndTime) {
      return false;
    }
  }

  const campaign = instance.campaign;

  const campaignStartTime = targets[campaign] &&
                            targets[campaign][kTimeOfDayKey] &&
                            targets[campaign][kTimeOfDayKey].time_start;

  const campaignEndTime = targets[campaign] &&
                            targets[campaign][kTimeOfDayKey] &&
                            targets[campaign][kTimeOfDayKey].time_end;

  if (campaignStartTime && campaignEndTime) {
    const campaignStartHourAndMinute = campaignStartTime.split(':');
    const campaignEndHourAndMinute = campaignEndTime.split(':');

    const campaignLocalStartTime = new Date().setHours(
      campaignStartHourAndMinute[0], campaignStartHourAndMinute[1], 0, 0
    ) - (currentDate.getTimezoneOffset() * 60 * 1000);

    const campaignLocalEndTime = new Date().setHours(
      campaignEndHourAndMinute[0], campaignEndHourAndMinute[1], 0, 0
    ) - (currentDate.getTimezoneOffset() * 60 * 1000);

    if (currentLocalTime < campaignLocalStartTime || currentLocalTime > campaignLocalEndTime) {
      return false;
    }
  }

  return true;
}

