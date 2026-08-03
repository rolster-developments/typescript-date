import {
  dateIsAfter,
  dateIsBefore,
  dateIsBetween,
  dateIsEquals,
  getTimeDifference,
  normalizeMaxTime,
  normalizeMinTime
} from '../lib';

export class DateRange {
  public readonly minDate: Date;

  public readonly maxDate: Date;

  constructor(minDate: Date, maxDate?: Date) {
    this.minDate = normalizeMinTime(minDate);

    this.maxDate =
      maxDate && dateIsBefore(maxDate, minDate)
        ? normalizeMaxTime(maxDate)
        : normalizeMaxTime(minDate);
  }

  public get minISOFormat(): string {
    return this.minDate.toISOString();
  }

  public get maxISOFormat(): string {
    return this.maxDate.toISOString();
  }

  public between(date: Date): boolean {
    return dateIsBetween(this.minDate, this.maxDate, date);
  }

  public equals({ maxDate, minDate }: DateRange) {
    return (
      dateIsEquals(this.minDate, minDate) && dateIsEquals(this.maxDate, maxDate)
    );
  }

  public recalculate(date: Date): DateRange {
    if (dateIsBefore(this.minDate, date)) {
      return new DateRange(date, this.maxDate);
    }

    if (dateIsAfter(this.maxDate, date)) {
      return new DateRange(this.minDate, date);
    }

    const minDifference = getTimeDifference(date, this.minDate);
    const maxDifference = getTimeDifference(this.maxDate, date);

    return minDifference > maxDifference
      ? new DateRange(this.minDate, date)
      : new DateRange(date, this.maxDate);
  }

  public static now(): DateRange {
    return new DateRange(new Date());
  }
}
