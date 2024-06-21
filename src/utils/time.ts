import moment from 'moment';

export async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function getNDaysAgo(delta: number, base?: string) {
  const date = moment(base)
    .utc()
    .subtract(base ? delta - 1 : delta, 'days');
  return date.format('DD MMM');
}

/**
 * @param startDateStr
 * @param delta
 */
export function getUtcTimeRange(startDateStr: string, delta = 1) {
  const startDate = new Date(startDateStr);
  startDate.setUTCHours(0, 0, 0, 0);
  // const startTimestamp = startDate.getTime();

  const nextDay = new Date(startDateStr);
  nextDay.setDate(nextDay.getDate() + delta);
  nextDay.setUTCHours(0, 0, 0, 0);
  // const endTimestamp = nextDay.getTime();

  return {
    start: startDate,
    end: nextDay,
  };
}
