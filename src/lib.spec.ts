import { dateFormatTemplate, dateIsEqualsWeight, getDateWeight } from './lib';

const date = new Date(2024, 4, 30, 10, 4, 24);

describe('formatDate', () => {
  it('should format for date template successful', () => {
    expect(dateFormatTemplate(date, '{dd}, {mx} del {yy}')).toBe(
      '30, May del 2024'
    );
    expect(dateFormatTemplate(date, '{yy}-{mm}-{dd}')).toBe('2024-05-30');
    expect(dateFormatTemplate(date, '{dd}/{mm}/{yy}')).toBe('30/05/2024');
  });

  it('should format for time template successful', () => {
    expect(dateFormatTemplate(date, '{hh}:{ii}:{ss}')).toBe('10:04:24');
    expect(dateFormatTemplate(date, '{hz}:{ii} {zz}')).toBe('10:04 AM');
  });

  it('should format for datetime template successful', () => {
    expect(dateFormatTemplate(date, '{yy}-{mm}-{dd} {hh}:{ii}:{ss}')).toBe(
      '2024-05-30 10:04:24'
    );
    expect(dateFormatTemplate(date, '{mx}. {dd}, {yy} {hz}:{ii} {zz}')).toBe(
      'May. 30, 2024 10:04 AM'
    );
    expect(dateFormatTemplate(date, '{yy}-{mm}-{dd}T{hh}:{ii}:{ss}')).toBe(
      '2024-05-30T10:04:24'
    );
  });
});

describe('getDateWeight', () => {
  it('should not collide across the boundary of a 31-day month', () => {
    const july31 = new Date(2026, 6, 31);
    const august1 = new Date(2026, 7, 1);

    expect(getDateWeight(july31)).not.toBe(getDateWeight(august1));
    expect(dateIsEqualsWeight(july31, august1)).toBe(false);
  });

  it('should be equal only for the same calendar day', () => {
    const today = new Date(2026, 7, 1, 9, 30, 0);
    const sameDay = new Date(2026, 7, 1, 23, 59, 59);

    expect(dateIsEqualsWeight(today, sameDay)).toBe(true);
  });
});
