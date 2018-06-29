export default function targetInstancesByDate(instances: any[]): any[] {
  const currentDate = new Date();
  const currentLocalTime = currentDate.getTime();

  return instances
    .filter(instance => {
      const startDate = new Date(instance.start).getTime();
      const endDate = new Date(instance.end).getTime();

      return currentLocalTime >= startDate && currentLocalTime < endDate;
    })
    .filter(Boolean);
}
