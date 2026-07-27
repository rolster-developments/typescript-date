export class Time {
  constructor(
    public readonly hour: number,
    public readonly minute: number,
    public readonly second = 0
  ) {
    if (hour < 0 || hour > 23) {
      throw new Error(`Invalid hour value: ${hour}, should be 0-23`);
    }

    if (minute < 0 || hour > 59) {
      throw new Error(`Invalid minute value: ${hour}, should be 0-59`);
    }

    if (second < 0 || second > 59) {
      throw new Error(`Invalid second value: ${second}, should be 0-59`);
    }
  }

  public get standardISOFormat(): string {
    const hour = String(this.hour).padStart(2, '0');
    const minute = String(this.minute).padStart(2, '0');
    const second = String(this.second).padStart(2, '0');

    return `${hour}:${minute}:${second}`;
  }

  public get normalizeISOFormat(): string {
    const hour = String(this.hour).padStart(2, '0');
    const minute = String(this.minute).padStart(2, '0');

    return `${hour}:${minute}`;
  }

  public get meridiemFormat(): string {
    const zoneIsPM = this.hour >= 12;

    const zone = zoneIsPM ? 'P.M.' : 'A.M.';

    const hourValue = zoneIsPM
      ? this.hour === 12
        ? 12
        : this.hour - 12
      : this.hour === 0
        ? 12
        : this.hour;

    const hour = String(hourValue).padStart(2, '0');
    const minute = String(this.minute).padStart(2, '0');
    const second = String(this.second).padStart(2, '0');

    return `${hour}:${minute}:${second} ${zone}`;
  }

  public get normalizeMeridiemFormat(): string {
    const zoneIsPM = this.hour >= 12;

    const zone = zoneIsPM ? 'P.M.' : 'A.M.';

    const hourValue = zoneIsPM
      ? this.hour === 12
        ? 12
        : this.hour - 12
      : this.hour === 0
        ? 12
        : this.hour;

    const hour = String(hourValue).padStart(2, '0');
    const minute = String(this.minute).padStart(2, '0');

    return `${hour}:${minute} ${zone}`;
  }

  private compareTo(time: Time): -1 | 0 | 1 {
    if (this.hour < time.hour) {
      return -1;
    }

    if (this.hour > time.hour) {
      return 1;
    }

    if (this.minute < time.minute) {
      return -1;
    }

    if (this.minute > time.minute) {
      return 1;
    }

    if (this.second < time.second) {
      return -1;
    }

    if (this.second > time.second) {
      return 1;
    }

    return 0;
  }

  public equals(time: Time): boolean {
    return this.compareTo(time) === 0;
  }

  public lessThan(time: Time): boolean {
    return this.compareTo(time) === -1;
  }

  public greaterThan(time: Time): boolean {
    return this.compareTo(time) === 1;
  }

  public lessThanOrEqual(other: Time): boolean {
    const result = this.compareTo(other);

    return result === -1 || result === 0;
  }

  public greaterThanOrEqual(other: Time): boolean {
    const result = this.compareTo(other);

    return result === 1 || result === 0;
  }

  public static now(normalize = true): Time {
    const currentTime = new Date();

    return new Time(
      currentTime.getHours(),
      currentTime.getMinutes(),
      normalize ? 0 : currentTime.getSeconds()
    );
  }
}
