// 한국식 돈 표기법
export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

// 시간이 얼마나 지났는지 경과여부 계산 로직
export function formatToTimeAgo(date: string): string {
  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diffInMs = now - time;

  const formatter = new Intl.RelativeTimeFormat("ko");

  if (diffInMs < msInMinute) {
    const diffInSeconds = Math.floor(diffInMs / msInSecond);
    return formatter.format(-diffInSeconds, "seconds");
  } else if (diffInMs < msInHour) {
    const diffInMinutes = Math.floor(diffInMs / msInMinute);
    return formatter.format(-diffInMinutes, "minutes");
  } else if (diffInMs < msInDay) {
    const diffInHours = Math.floor(diffInMs / msInHour);
    return formatter.format(-diffInHours, "hours");
  } else {
    const diffInDays = Math.floor(diffInMs / msInDay);
    return formatter.format(-diffInDays, "days");
  }
}
