const formatComplet = (value: number, size: number): string => {
  return value.toString().padStart(size, '0');
};

export enum MonthName {
  January = 'Enero',
  February = 'Febrero',
  March = 'Marzo',
  April = 'Abril',
  May = 'Mayo',
  June = 'Junio',
  July = 'Julio',
  August = 'Agosto',
  September = 'Septiembre',
  October = 'Octubre',
  November = 'Noviembre',
  December = 'Diciembre'
}

export enum MonthLabel {
  January = 'Ene',
  February = 'Feb',
  March = 'Mar',
  April = 'Abr',
  May = 'May',
  June = 'Jun',
  July = 'Jul',
  August = 'Ago',
  September = 'Sep',
  October = 'Oct',
  November = 'Nov',
  December = 'Dic'
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

export const MONTH_NAMES = [
  MonthName.January,
  MonthName.February,
  MonthName.March,
  MonthName.April,
  MonthName.May,
  MonthName.June,
  MonthName.July,
  MonthName.August,
  MonthName.September,
  MonthName.October,
  MonthName.November,
  MonthName.December
];

export const MONTH_LABELS = [
  MonthLabel.January,
  MonthLabel.February,
  MonthLabel.March,
  MonthLabel.April,
  MonthLabel.May,
  MonthLabel.June,
  MonthLabel.July,
  MonthLabel.August,
  MonthLabel.September,
  MonthLabel.October,
  MonthLabel.November,
  MonthLabel.December
];

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

export const DAYS_NAME = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const DAYS_NAME_MIN = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export enum Miliseconds {
  Year = 31536000000,
  Month = 2592000000,
  Week = 604800000,
  Day = 86400000,
  Hour = 3600000,
  Minute = 60000,
  Second = 1000
}

type DateFormat = Record<string, (date: Date) => string>;

const formatHour = (date: Date): number => {
  const hour = date.getHours();

  return hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
};

const verifyDayYear = (date: Date, year: number): void => {
  const days = fetchMonthDays(year, date.getMonth());

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setFullYear(year); // Establecer el año
};

const verifyDayMonth = (date: Date, month: number): void => {
  const days = fetchMonthDays(date.getFullYear(), month);

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
    return DAYS_NAME[date.getDay()];
  },
  dx: (date: Date): string => {
    return DAYS_NAME_MIN[date.getDay()];
  },
  mm: (date: Date): string => {
    return formatComplet(date.getMonth() + 1, 2);
  },
  mn: (date: Date): string => {
    return MONTH_NAMES[date.getDay()];
  },
  mx: (date: Date): string => {
    return MONTH_LABELS[date.getMonth()];
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

export const isSameWeight = (date: Date, compare = new Date()): boolean => {
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
  const newDate = new Date(date.getTime());

  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

export const normalizeMaxTime = (date: Date): Date => {
  const newDate = new Date(date.getTime());

  newDate.setHours(23);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setMilliseconds(0);

  return newDate;
};

export const weight = (date: Date): number => {
  return date.getFullYear() * 365 + (date.getMonth() + 1) * 30 + date.getDate();
};

export const fetchMonthDays = (year: number, month: number): number => {
  return month === 1 && isLeapYear(year) ? 29 : MONTH_DAYS[month];
};

export const isLeapYear = (year: number): boolean => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

export const formatDate = (date: Date, pattern: string): string => {
  let format = pattern;

  Object.keys(FORMATTERS).forEach((key) => {
    if (format.includes(key)) {
      format = format.replace(key, FORMATTERS[key](date));
    }
  });

  return format;
};

export const createDate = (
  year?: number,
  month?: number,
  day?: number
): Date => {
  const resultDate = new Date();

  if (year) {
    verifyDayYear(resultDate, year);
  }

  if (month) {
    verifyDayMonth(resultDate, month);
  }

  if (day) {
    resultDate.setDate(day);
  }

  return resultDate;
};

export const refactorYear = (date: Date, year: number): Date => {
  const resultDate = new Date(date.getTime());

  verifyDayYear(resultDate, year);

  resultDate.setFullYear(year);

  return resultDate;
};

export const refactorMonth = (date: Date, month: number): Date => {
  const resultDate = new Date(date.getTime());

  verifyDayMonth(resultDate, month);

  resultDate.setMonth(month);

  return resultDate;
};

export const refactorDay = (date: Date, day: number): Date => {
  const resultDate = new Date(date.getTime());

  resultDate.setDate(day);

  return resultDate;
};
