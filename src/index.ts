import { i18nSubscribe } from '@rolster/i18n';
import dateI18n from './i18n';

let MONTH_NAMES_I18N: string[] = [];
let MONTH_LABELS_I18N: string[] = [];
let DAY_NAMES_I18N: string[] = [];
let DAY_LABELS_I18N: string[] = [];

function loadI18n(language = 'es'): void {
  MONTH_NAMES_I18N = [
    dateI18n('january', { language }),
    dateI18n('february', { language }),
    dateI18n('march', { language }),
    dateI18n('april', { language }),
    dateI18n('may', { language }),
    dateI18n('june', { language }),
    dateI18n('july', { language }),
    dateI18n('august', { language }),
    dateI18n('september', { language }),
    dateI18n('october', { language }),
    dateI18n('november', { language }),
    dateI18n('december', { language })
  ];

  MONTH_LABELS_I18N = MONTH_NAMES_I18N.map((name) => name.substring(0, 3));

  DAY_NAMES_I18N = [
    dateI18n('sunday', { language }),
    dateI18n('monday', { language }),
    dateI18n('tuesday', { language }),
    dateI18n('wednesday', { language }),
    dateI18n('thursday', { language }),
    dateI18n('friday', { language }),
    dateI18n('saturday', { language })
  ];

  DAY_LABELS_I18N = DAY_NAMES_I18N.map((name) => name.substring(0, 3));
}

loadI18n();

i18nSubscribe((language) => loadI18n(language));

export enum Miliseconds {
  Year = 31536000000,
  Month = 2592000000,
  Week = 604800000,
  Day = 86400000,
  Hour = 3600000,
  Minute = 60000,
  Second = 1000
}

export enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export enum MonthDay {
  January = 31,
  February = 28,
  March = 31,
  April = 30,
  May = 31,
  June = 30,
  July = 31,
  August = 31,
  September = 30,
  October = 31,
  November = 30,
  December = 31
}

export const MONTH_DAYS = [
  MonthDay.January,
  MonthDay.February,
  MonthDay.March,
  MonthDay.April,
  MonthDay.May,
  MonthDay.June,
  MonthDay.July,
  MonthDay.August,
  MonthDay.September,
  MonthDay.October,
  MonthDay.November,
  MonthDay.December
];

export const MONTH_NAMES = (): string[] => {
  return MONTH_NAMES_I18N;
};

export const MONTH_LABELS = (): string[] => {
  return MONTH_LABELS_I18N;
};

export const DAY_NAMES = (): string[] => {
  return DAY_NAMES_I18N;
};

export const DAY_LABELS = (): string[] => {
  return DAY_LABELS_I18N;
};

type DateFormat = Record<string, (date: Date) => string>;

const formatComplet = (value: number, size: number): string => {
  return value.toString().padStart(size, '0');
};

const formatHour = (date: Date): number => {
  const hour = date.getHours();

  return hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
};

const verifyDayInYear = (date: Date, year: number): void => {
  const days = daysFromMonth(year, date.getMonth());

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setFullYear(year); // Establecer el año
};

const verifyDayInMonth = (date: Date, month: number): void => {
  const days = daysFromMonth(date.getFullYear(), month);

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setMonth(month); // Establecer el mes
};

const FORMATTERS: DateFormat = {
  dd: (date: Date): string => {
    return formatComplet(date.getDate(), 2);
  },
  dw: (date: Date): string => {
    return DAY_NAMES_I18N[date.getDay()];
  },
  dx: (date: Date): string => {
    return DAY_LABELS_I18N[date.getDay()];
  },
  mm: (date: Date): string => {
    return formatComplet(date.getMonth() + 1, 2);
  },
  mn: (date: Date): string => {
    return MONTH_NAMES_I18N[date.getDay()];
  },
  mx: (date: Date): string => {
    return MONTH_LABELS_I18N[date.getMonth()];
  },
  aa: (date: Date): string => {
    return formatComplet(date.getFullYear(), 4);
  },
  hh: (date: Date): string => {
    return formatComplet(date.getHours(), 2);
  },
  ii: (date: Date): string => {
    return formatComplet(date.getMinutes(), 2);
  },
  ss: (date: Date): string => {
    return formatComplet(date.getSeconds(), 2);
  },
  hz: (date: Date): string => {
    return formatComplet(formatHour(date), 2);
  },
  zz: (date: Date): string => {
    return date.getHours() > 11 ? 'PM' : 'AM';
  }
};

interface ElapsedTime {
  value: number;
  label: string;
  single: string;
  plural: string;
}

interface PendingTime {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const createElapsedTime = (
  value: Miliseconds,
  single: string,
  charPlural = 's',
  plural?: string
): ElapsedTime => {
  plural = plural || `${single}${charPlural}`;

  const label = `${single}(${charPlural})`;

  return {
    value,
    label,
    single,
    plural
  };
};

const ELAPSED_TIMES: ElapsedTime[] = [
  createElapsedTime(Miliseconds.Year, 'año'),
  createElapsedTime(Miliseconds.Month, 'mes', 'es'),
  createElapsedTime(Miliseconds.Week, 'semana'),
  createElapsedTime(Miliseconds.Day, 'día', 's', 'dias'),
  createElapsedTime(Miliseconds.Hour, 'hora'),
  createElapsedTime(Miliseconds.Minute, 'minuto'),
  createElapsedTime(Miliseconds.Second, 'segundo')
];

export const formatForHumans = (milliseconds: number): string => {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let description = '';
  let index = 0;

  while (description === '' && index < ELAPSED_TIMES.length) {
    const elapsed = ELAPSED_TIMES[index];
    const result = Math.floor(value / elapsed.value);

    if (result >= 1) {
      const label = result === 1 ? elapsed.single : elapsed.plural;

      description = `${prefix} ${result} ${label}`;
    }

    index++;
  }

  return description;
};

export const pendingTime = (
  initial: Date,
  future = new Date()
): PendingTime => {
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
};

export const refactorFromDays = (date: Date, days = 1): Date => {
  return refactorFromTimestamp(date, days * Miliseconds.Day);
};

export const refactorFromMonth = (date: Date, months = 1): Date => {
  return refactorFromTimestamp(date, months * Miliseconds.Month);
};

export const refactorFromTimestamp = (date: Date, timestamp: number): Date => {
  return new Date(date.getTime() + timestamp);
};

export const isEquals = (date: Date, compare = new Date()): boolean => {
  return date.getTime() === compare.getTime();
};

export const isWeight = (date: Date, compare = new Date()): boolean => {
  return weight(date) === weight(compare);
};

export const isBefore = (date: Date, compare = new Date()): boolean => {
  return date.getTime() > compare.getTime();
};

export const isBeforeOrEquals = (date: Date, compare = new Date()): boolean => {
  return date.getTime() >= compare.getTime();
};

export const isAfter = (date: Date, compare = new Date()): boolean => {
  return date.getTime() < compare.getTime();
};

export const isAfterOrEquals = (date: Date, compare = new Date()): boolean => {
  return date.getTime() <= compare.getTime();
};

export const isBetween = (
  minDate: Date,
  maxDate: Date,
  compare = new Date()
): boolean => {
  return isAfter(minDate, compare) && isBefore(maxDate, compare);
};

export const isBetweenOrEquals = (
  minDate: Date,
  maxDate: Date,
  compare = new Date()
): boolean => {
  return (
    isAfterOrEquals(minDate, compare) || isBeforeOrEquals(maxDate, compare)
  );
};

export function timeDifference(date: Date, compare = new Date()): number {
  return date.getTime() - compare.getTime();
}

export const differenceForHumans = (
  date: Date,
  compare = new Date()
): string => {
  return formatForHumans(timeDifference(date, compare));
};

export const normalizeMinTime = (date: Date): Date => {
  const normalize = new Date(date.getTime());

  normalize.setHours(0);
  normalize.setMinutes(0);
  normalize.setSeconds(0);
  normalize.setMilliseconds(0);

  return normalize;
};

export const normalizeMaxTime = (date: Date): Date => {
  const normalize = new Date(date.getTime());

  normalize.setHours(23);
  normalize.setMinutes(59);
  normalize.setSeconds(59);
  normalize.setMilliseconds(0);

  return normalize;
};

export const weight = (date: Date): number => {
  return date.getFullYear() * 365 + (date.getMonth() + 1) * 30 + date.getDate();
};

export const daysFromMonth = (year: number, month: number): number => {
  return month === 1 && isLeapYear(year) ? 29 : MONTH_DAYS[month];
};

export const isLeapYear = (year: number): boolean => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

const regInterpolation = /{([^{}]*)}/g;

export const formatDate = (date: Date, template: string): string => {
  return template.replace(regInterpolation, (value, key) =>
    FORMATTERS[key] ? FORMATTERS[key](date) : value
  );
};

interface CreateDate {
  day?: number;
  month?: number;
  year?: number;
}

export const createDate = ({ day, month, year }: CreateDate): Date => {
  const result = new Date();

  if (year) {
    verifyDayInYear(result, year);
  }

  if (month) {
    verifyDayInMonth(result, month);
  }

  if (day) {
    result.setDate(day);
  }

  return result;
};

export const refactorYear = (date: Date, year: number): Date => {
  const refactor = new Date(date.getTime());

  verifyDayInYear(refactor, year);

  refactor.setFullYear(year);

  return refactor;
};

export const refactorMonth = (date: Date, month: number): Date => {
  const refactor = new Date(date.getTime());

  verifyDayInMonth(refactor, month);

  refactor.setMonth(month);

  return refactor;
};

export const refactorDay = (date: Date, day: number): Date => {
  const refactor = new Date(date.getTime());

  refactor.setDate(day);

  return refactor;
};
