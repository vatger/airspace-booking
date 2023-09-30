export const createDateWithTime = (
  dayOffsetFromToday: number,
  hours: number,
  minutes: number
) => {
  const date = new Date();

  date.setDate(date.getDate() + dayOffsetFromToday);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date;
};

export default createDateWithTime;
