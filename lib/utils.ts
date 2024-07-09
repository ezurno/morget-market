// 한국식 돈 표기법
export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

// 시간이 얼마나 지났는지 경과여부 계산 로직
export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  // 날짜에 맞춰서 형식을 바꿔주는 Intl
  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}
