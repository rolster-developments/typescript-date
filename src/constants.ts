import { i18nSubscribe, LanguageCode } from '@rolster/i18n';
import { dateI18n } from './i18n';
import { MonthDay } from './types';

let MONTH_NAMES_I18N: string[] = [];
let MONTH_LABELS_I18N: string[] = [];
let DAY_NAMES_I18N: string[] = [];
let DAY_LABELS_I18N: string[] = [];

function loadI18n(language: LanguageCode = 'es'): void {
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

function isNumber(value?: number): value is number {
  return value !== undefined && value !== null;
}

loadI18n();

i18nSubscribe((language) => {
  loadI18n(language);
});

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

export function MONTH_NAMES(index: number): string;
export function MONTH_NAMES(): string[];
export function MONTH_NAMES(index?: number): string[] | string {
  return isNumber(index) ? MONTH_NAMES_I18N[index] || '' : MONTH_NAMES_I18N;
}

export function MONTH_LABELS(index: number): string;
export function MONTH_LABELS(): string[];
export function MONTH_LABELS(index?: number): string[] | string {
  return isNumber(index) ? MONTH_LABELS_I18N[index] || '' : MONTH_LABELS_I18N;
}

export function DAY_NAMES(index: number): string;
export function DAY_NAMES(): string[];
export function DAY_NAMES(index?: number): string[] | string {
  return isNumber(index) ? DAY_NAMES_I18N[index] || '' : DAY_NAMES_I18N;
}

export function DAY_LABELS(index: number): string;
export function DAY_LABELS(): string[];
export function DAY_LABELS(index?: number): string[] | string {
  return isNumber(index) ? DAY_LABELS_I18N[index] || '' : DAY_LABELS_I18N;
}
