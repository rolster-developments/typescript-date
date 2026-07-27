# Rolster Date Utilities

Utility package for manipulating Date compatible with Typescript projects.

## Installation

```
npm i @rolster/dates
```

## Configuration

You must install the `@rolster/types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

## Features

All `Date` helpers are immutable: they return a brand new `Date` instead of
mutating the one you pass in.

### Formatting

`dateFormatTemplate` renders a `Date` using a template with `{token}`
placeholders:

```typescript
import { dateFormatTemplate } from '@rolster/dates';

const date = new Date('2026-06-08T15:30:45');

dateFormatTemplate(date, '{dd}/{mm}/{yy}'); // '08/06/2026'
dateFormatTemplate(date, '{dd} {mn} {yy}'); // '08 Junio 2026' (es by default)
dateFormatTemplate(date, '{hh}:{ii}:{ss}'); // '15:30:45'
dateFormatTemplate(date, '{hz}:{ii} {zz}'); // '03:30 PM'
```

| Token | Meaning                 | Token | Meaning             |
| ----- | ----------------------- | ----- | ------------------- |
| `dd`  | day (2 digits)          | `yy`  | year (4 digits)     |
| `dw`  | day-of-week name        | `yx`  | year (2 digits)     |
| `mm`  | month number (2 digits) | `hh`  | hour 24h (2 digits) |
| `mn`  | month name              | `hz`  | hour 12h (2 digits) |
| `mx`  | month label (short)     | `ii`  | minutes (2 digits)  |
| `ss`  | seconds (2 digits)      | `zz`  | meridiem (AM/PM)    |

### Human readable elapsed time

```typescript
import { getTimeDifferenceForHumans, calculateAge } from '@rolster/dates';

getTimeDifferenceForHumans(new Date('2026-06-10')); // 'Falta 2 días'
getTimeDifferenceForHumans(new Date('2026-06-06')); // 'Hace 2 días'

calculateAge(new Date('1990-05-01')); // { years: 36, months: 1, days: 7 }
```

### Arithmetic

```typescript
import {
  increaseDaysInDate,
  decreaseDaysInDate,
  increaseWeeksInDate,
  createDate,
  assignMonthInDate
} from '@rolster/dates';

increaseDaysInDate(new Date('2026-06-08'), 5); // 2026-06-13
decreaseDaysInDate(new Date('2026-06-08'), 1); // 2026-06-07
increaseWeeksInDate(new Date('2026-06-08'), 2); // 2026-06-22

createDate({ year: 2026, month: 5, day: 8 }); // safe builder (clamps invalid days)
assignMonthInDate(new Date(), 11); // same date, month set to December
```

### Comparisons

```typescript
import {
  dateIsEquals,
  dateIsEqualsWeight,
  dateIsBetween,
  getTimeDifference
} from '@rolster/dates';

const a = new Date('2026-06-08');
const b = new Date('2026-06-10');

dateIsEquals(a, a); // true (exact same timestamp)
dateIsEqualsWeight(a, b); // false (different calendar day, ignores time)

// is `c` inside the (min, max) interval?
dateIsBetween(a, new Date('2026-06-15'), b); // true

getTimeDifference(b, a); // 172800000 (b - a, in milliseconds)
```

> Note: the directional helpers `dateIsBefore` / `dateIsAfter` (and their
> `...OrEquals` variants) take `(date, compare = new Date())`. They compare the
> two timestamps, so always double-check the argument order for your use case.

Other helpers: `normalizeMinTime`/`normalizeMaxTime` (set time to start/end of
day), `getDaysOfMonth`, `isLeapYear`, `getDateWeight`, `dateToJson`,
`cloneDate`.

### Value objects

**Time** — an immutable, comparable time of day with several string formats:

```typescript
import { Time } from '@rolster/dates';

const time = new Time(15, 30); // 15:30:00

time.standardISOFormat; // '15:30:00'
time.normalizeISOFormat; // '15:30'
time.meridiemFormat; // '03:30:00 P.M.'
time.normalizeMeridiemFormat; // '03:30 P.M.'

Time.now(); // current time (seconds normalized to 0)

time.greaterThan(new Time(9, 0)); // true
time.lessThanOrEqual(new Time(18, 0)); // true
```

**DateTime** — wraps a `Date` with cached, ready-to-use formats:

```typescript
import { DateTime } from '@rolster/dates';

const dt = new DateTime(new Date('2026-06-08T15:30:00'));

dt.dateFormat; // '08/Jun/2026' ({mx} = short month label, es by default)
dt.dateTimeFormat; // '08/Jun/2026 15:30 PM'
```

**DateRange** — a normalized `[minDate, maxDate]` interval:

```typescript
import { DateRange } from '@rolster/dates';

const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));

range.between(new Date('2026-06-15')); // true
range.minISOFormat; // '2026-06-01T...'
range.recalculate(new Date('2026-07-10')); // grows the range to include the date
```

### Constants & enums

```typescript
import {
  Miliseconds,
  Day,
  Month,
  MONTH_NAMES,
  DAY_NAMES
} from '@rolster/dates';

Miliseconds.Day; // 86400000
Month.December; // 11
Day.Monday;

MONTH_NAMES(); // ['Enero', 'Febrero', ...] (es by default)
MONTH_NAMES(0); // 'Enero'
DAY_NAMES(0); // 'Domingo'
```

Month/day names are localized through `@rolster/i18n` (default locale `es`,
also ships `en`). Switching the locale updates these helpers reactively.

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
