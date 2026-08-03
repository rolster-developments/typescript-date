import { Criteria, CriteriaCallback } from '@rolster/commons';
import { normalizeMinTime } from '../lib';
import { DateRange } from '../values/date-range';

export class DateRangeCriteria extends Criteria<DateRange> {
  constructor(
    key: string,
    public readonly minKey: string,
    public readonly maxKey: string,
    value: DateRange
  ) {
    super(key, value);
  }

  public equals(value: DateRange): boolean {
    return this.value.equals(value);
  }
}

export class DateRangeTimeCriteria extends DateRangeCriteria {
  public assign(callback: CriteriaCallback): void {
    callback(this.minKey, this.value.minDate.getTime());
    callback(this.maxKey, this.value.maxDate.getTime());
  }
}

export class DateRangeISOCriteria extends DateRangeCriteria {
  public assign(callback: CriteriaCallback): void {
    callback(this.minKey, this.value.minISOFormat);
    callback(this.maxKey, normalizeMinTime(this.value.maxDate).toISOString());
  }
}

export class DateTimeRangeISOCriteria extends DateRangeCriteria {
  public assign(callback: CriteriaCallback): void {
    callback(this.minKey, this.value.minISOFormat);
    callback(this.maxKey, this.value.maxISOFormat);
  }
}
