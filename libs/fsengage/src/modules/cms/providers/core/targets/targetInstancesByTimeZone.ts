const targetInstancesByTimeZone = (instance: any, targets: Record<string, any>): boolean => {
  if (!instance) {
    return false;
  }

  if (!targets) {
    return true;
  }

  const instanceTimeZone =
    instance.targets && instance.targets.Timezone && instance.targets.Timezone.timezone;

  const { campaign } = instance;
  const campaignTimeZone =
    targets[campaign] && targets[campaign].Timezone && targets[campaign].Timezone.timezone;

  const currentDate = new Date();

  if (instanceTimeZone && instanceTimeZone !== String(currentDate.getTimezoneOffset())) {
    return false;
  }

  if (campaignTimeZone && campaignTimeZone !== String(currentDate.getTimezoneOffset())) {
    return false;
  }

  return true;
};

export default targetInstancesByTimeZone;
