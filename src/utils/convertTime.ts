function formatToLocalDateTime(datetime: string): string {
  const [date, timeWithMs] = datetime.split("T");
  const [hour, minute, second] = timeWithMs.slice(0, 8).split(":");
  const hourNum = Number(hour);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${date} ${hour12}:${minute}:${second} ${ampm}`;
}

export default formatToLocalDateTime
