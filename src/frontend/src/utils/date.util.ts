const createDateWithUtcTime = (
  dayOffsetFromToday: number,
  hours: number,
  minutes: number,
) => {
  const date = new Date();

  date.setUTCDate(date.getUTCDate() + dayOffsetFromToday);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date;
};

const createDateForDuration = (hours: number) => {
  const date = new Date(0);

  date.setHours(hours);

  return date;
};

export { createDateForDuration, createDateWithUtcTime };
