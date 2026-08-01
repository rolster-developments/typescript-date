import { DAY_NAMES, MONTH_DAYS, MONTH_LABELS, MONTH_NAMES } from './constants';
import { Miliseconds } from './types';

type DateFormat = Record<string, (date: Date) => string>;

export interface DateJson {
  day: number;
  month: number;
  year: number;
}

function completFormat(value: number, size: number): string {
  return value.toString().padStart(size, '0');
}

function hourFormat(date: Date): number {
  const hour = date.getHours();

  return hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
}

function verifyDayInYear(date: Date, year: number): void {
  const days = getDaysOfMonth(year, date.getMonth());

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setFullYear(year); // Define year
}

function verifyDayInMonth(date: Date, month: number): void {
  const days = getDaysOfMonth(date.getFullYear(), month);

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setMonth(month); // Define month
}

const formatters: DateFormat = {
  dd: (date: Date): string => {
    return completFormat(date.getDate(), 2);
  },
  dw: (date: Date): string => {
    return DAY_NAMES()[date.getDay()];
  },
  dx: (date: Date): string => {
    return DAY_NAMES()[date.getDay()];
  },
  mm: (date: Date): string => {
    return completFormat(date.getMonth() + 1, 2);
  },
  mn: (date: Date): string => {
    return MONTH_NAMES(date.getMonth());
  },
  mx: (date: Date): string => {
    return MONTH_LABELS(date.getMonth());
  },
  yy: (date: Date): string => {
    return completFormat(date.getFullYear(), 4);
  },
  yx: (date: Date): string => {
    return String(date.getFullYear()).slice(-2);
  },
  hh: (date: Date): string => {
    return completFormat(date.getHours(), 2);
  },
  ii: (date: Date): string => {
    return completFormat(date.getMinutes(), 2);
  },
  ss: (date: Date): string => {
    return completFormat(date.getSeconds(), 2);
  },
  hz: (date: Date): string => {
    return completFormat(hourFormat(date), 2);
  },
  zz: (date: Date): string => {
    return date.getHours() > 11 ? 'PM' : 'AM';
  }
};

interface ElapsedTime {
  label: string;
  plural: string;
  single: string;
  value: number;
}

interface PendingTime {
  days: number;
  hours: number;
  minutes: number;
  months: number;
  seconds: number;
  weeks: number;
  years: number;
}

export interface ElapsedDate {
  days: number;
  months: number;
  years: number;
}

const ELAPSED_DATE_EMPTY: ElapsedDate = {
  days: 0,
  months: 0,
  years: 0
};

function createElapsedTime(
  value: Miliseconds,
  single: string,
  charPlural = 's',
  plural?: string
): ElapsedTime {
  plural = plural || `${single}${charPlural}`;

  const label = `${single}(${charPlural})`;

  return {
    value,
    label,
    single,
    plural
  };
}

const ELAPSED_TIMES: ElapsedTime[] = [
  createElapsedTime(Miliseconds.Year, 'año'),
  createElapsedTime(Miliseconds.Month, 'mes', 'es'),
  createElapsedTime(Miliseconds.Week, 'semana'),
  createElapsedTime(Miliseconds.Day, 'día', 's', 'dias'),
  createElapsedTime(Miliseconds.Hour, 'hora'),
  createElapsedTime(Miliseconds.Minute, 'minuto'),
  createElapsedTime(Miliseconds.Second, 'segundo')
];

export function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

export function dateToJson(date: Date): DateJson {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear()
  };
}

export function dateFormatForHumans(milliseconds: number): string {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let format = '';
  let index = 0;

  while (format === '' && index < ELAPSED_TIMES.length) {
    const elapsed = ELAPSED_TIMES[index];
    const result = Math.floor(value / elapsed.value);

    if (result >= 1) {
      const label = result === 1 ? elapsed.single : elapsed.plural;

      format = `${prefix} ${result} ${label}`;
    }

    index++;
  }

  return format;
}

export function calculateElapsed(
  dateStart: Undefined<Date>,
  dateEnd: Undefined<Date>
): ElapsedDate {
  if (!dateStart || !dateEnd || dateStart > dateEnd) {
    return ELAPSED_DATE_EMPTY;
  }

  let years = dateEnd.getFullYear() - dateStart.getFullYear();
  let months = dateEnd.getMonth() - dateStart.getMonth();
  let days = dateEnd.getDate() - dateStart.getDate();

  if (days < 0) {
    months -= 1;

    const datePreviousMonth = new Date(
      dateEnd.getFullYear(),
      dateEnd.getMonth(),
      0
    );

    days += datePreviousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    return ELAPSED_DATE_EMPTY;
  }

  return { days, months, years };
}

export function calculateAge(birthDate: Undefined<Date>): ElapsedDate {
  return calculateElapsed(birthDate, new Date());
}

export function getPendingTime(
  initial: Date,
  future = new Date()
): PendingTime {
  const difference = future.getTime() - initial.getTime();

  return {
    years: Math.floor(difference / Miliseconds.Year),
    months: Math.floor(difference / Miliseconds.Month),
    weeks: Math.floor(difference / Miliseconds.Week),
    days: Math.floor(difference / Miliseconds.Day),
    hours: Math.floor(difference / Miliseconds.Hour),
    minutes: Math.floor(difference / Miliseconds.Minute),
    seconds: Math.floor(difference / Miliseconds.Second)
  };
}

export function increaseTimestampInDate(date: Date, timestamp: number): Date {
  return new Date(date.getTime() + timestamp);
}

export function increaseDaysInDate(date: Date, days = 1): Date {
  return increaseTimestampInDate(date, days * Miliseconds.Day);
}

export function increaseWeeksInDate(date: Date, week = 1): Date {
  return increaseTimestampInDate(date, week * Miliseconds.Week);
}

export function decreaseTimestampInDate(date: Date, timestamp: number): Date {
  return new Date(date.getTime() - timestamp);
}

export function decreaseDaysInDate(date: Date, days = 1): Date {
  return decreaseTimestampInDate(date, days * Miliseconds.Day);
}

export function decreaseWeeksInDate(date: Date, week = 1): Date {
  return decreaseTimestampInDate(date, week * Miliseconds.Week);
}

export function getDateWeight(date: Date): number {
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
}

export function dateIsEquals(date: Date, compare = new Date()): boolean {
  return date.getTime() === compare.getTime();
}

export function dateIsEqualsWeight(date: Date, compare = new Date()): boolean {
  return getDateWeight(date) === getDateWeight(compare);
}

export function dateIsBefore(date: Date, compare = new Date()): boolean {
  return date.getTime() > compare.getTime();
}

export function dateIsBeforeOrEquals(
  date: Date,
  compare = new Date()
): boolean {
  return date.getTime() >= compare.getTime();
}

export function dateIsAfter(date: Date, compare = new Date()): boolean {
  return date.getTime() < compare.getTime();
}

export function dateIsAfterOrEquals(date: Date, compare = new Date()): boolean {
  return date.getTime() <= compare.getTime();
}

export function dateIsBetween(
  minDate: Date,
  maxDate: Date,
  compare = new Date()
): boolean {
  return dateIsAfter(minDate, compare) && dateIsBefore(maxDate, compare);
}

export function dateIsBetweenOrEquals(
  minDate: Date,
  maxDate: Date,
  compare = new Date()
): boolean {
  return (
    dateIsAfterOrEquals(minDate, compare) ||
    dateIsBeforeOrEquals(maxDate, compare)
  );
}

export function getTimeDifference(date: Date, compare = new Date()): number {
  return date.getTime() - compare.getTime();
}

export function getTimeDifferenceForHumans(
  date: Date,
  compare = new Date()
): string {
  return dateFormatForHumans(getTimeDifference(date, compare));
}

export function normalizeMinTime(date: Date): Date {
  const normalize = new Date(date.getTime());

  normalize.setHours(0);
  normalize.setMinutes(0);
  normalize.setSeconds(0);
  normalize.setMilliseconds(0);

  return normalize;
}

export function normalizeMaxTime(date: Date): Date {
  const normalize = new Date(date.getTime());

  normalize.setHours(23);
  normalize.setMinutes(59);
  normalize.setSeconds(59);
  normalize.setMilliseconds(0);

  return normalize;
}

export function getDaysOfMonth(year: number, month: number): number {
  return month === 1 && isLeapYear(year) ? 29 : MONTH_DAYS[month];
}

export function isLeapYear(value: Date | number): boolean {
  const year = value instanceof Date ? value.getFullYear() : value;

  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

const REGEX_INTERPOLATION = /{([^{}]*)}/g;

export function dateFormatTemplate(date: Date, template: string): string {
  return template.replace(REGEX_INTERPOLATION, (value, key) =>
    formatters[key] ? formatters[key](date) : value
  );
}

interface CreateDate {
  day?: number;
  month?: number;
  year?: number;
}

export function createDate({ day, month, year }: CreateDate): Date {
  const newDate = new Date();

  if (year) {
    verifyDayInYear(newDate, year);
  }

  if (month !== undefined) {
    verifyDayInMonth(newDate, month);
  }

  if (day) {
    newDate.setDate(day);
  }

  return newDate;
}

export function assignYearInDate(date: Date, year: number): Date {
  const newDate = new Date(date.getTime());

  verifyDayInYear(newDate, year);

  newDate.setFullYear(year);

  return newDate;
}

export function assignMonthInDate(date: Date, month: number): Date {
  const newDate = new Date(date.getTime());

  verifyDayInMonth(newDate, month);

  newDate.setMonth(month);

  return newDate;
}

export function assignDayInDate(date: Date, day: number): Date {
  const newDate = new Date(date.getTime());

  newDate.setDate(day);

  return newDate;
}
