import { describe, expect, test } from 'vitest';
import { isHoliday, addBusinessDays } from './index.js';

describe('Calendar Module', () => {
  describe('isHoliday', () => {
    test('Identifies fixed national holidays', () => {
      // 1 de Mayo (Día del Trabajo)
      expect(isHoliday(new Date('2024-05-01T12:00:00'))).toBe(true);
      // 15 de Septiembre (Independencia)
      expect(isHoliday(new Date('2026-09-15T12:00:00'))).toBe(true);
    });

    test('Identifies non-holidays', () => {
      // 2 de Mayo
      expect(isHoliday(new Date('2024-05-02T12:00:00'))).toBe(false);
    });

    test('Identifies dynamic Holy Week (Semana Santa) using Computus', () => {
      // En 2024: Jueves Santo fue 28 de marzo, Viernes Santo 29 de marzo.
      expect(isHoliday(new Date('2024-03-28T12:00:00'))).toBe(true);
      expect(isHoliday(new Date('2024-03-29T12:00:00'))).toBe(true);
      // 27 de marzo no fue asueto nacional
      expect(isHoliday(new Date('2024-03-27T12:00:00'))).toBe(false);

      // En 2025: Domingo de Ramos es 13 de abril. Jueves Santo 17, Viernes Santo 18.
      expect(isHoliday(new Date('2025-04-17T12:00:00'))).toBe(true);
      expect(isHoliday(new Date('2025-04-18T12:00:00'))).toBe(true);
    });

    test('Identifies shifted Army Day (Decreto 42-2010)', () => {
      // 2024: 30 de junio cayó domingo -> se movió al lunes 1 de julio.
      expect(isHoliday(new Date('2024-06-30T12:00:00'))).toBe(false); // Domingo ya no es el asueto oficial laboral
      expect(isHoliday(new Date('2024-07-01T12:00:00'))).toBe(true); // Lunes es el asueto

      // 2026: 30 de junio cae martes -> se mueve al lunes 29 de junio.
      expect(isHoliday(new Date('2026-06-30T12:00:00'))).toBe(false);
      expect(isHoliday(new Date('2026-06-29T12:00:00'))).toBe(true);

      // 2028: 30 de junio cae viernes -> se mueve al lunes 3 de julio.
      expect(isHoliday(new Date('2028-06-30T12:00:00'))).toBe(false);
      expect(isHoliday(new Date('2028-07-03T12:00:00'))).toBe(true);
    });
  });

  describe('addBusinessDays', () => {
    test('Adds normal business days without crossing weekends', () => {
      // Wednesday, May 8, 2024 + 2 days = Friday, May 10, 2024
      const start = new Date('2024-05-08T12:00:00');
      const result = addBusinessDays(start, 2);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(4); // 0-indexed May
      expect(result.getDate()).toBe(10);
    });

    test('Skips weekends correctly', () => {
      // Friday, May 10, 2024 + 1 day = Monday, May 13, 2024
      const start = new Date('2024-05-10T12:00:00');
      const result = addBusinessDays(start, 1);
      expect(result.getDate()).toBe(13);
    });

    test('Skips holidays correctly', () => {
      // Tuesday, April 30, 2024 + 1 day = Thursday, May 2, 2024 (May 1 is holiday)
      const start = new Date('2024-04-30T12:00:00');
      const result = addBusinessDays(start, 1);
      expect(result.getDate()).toBe(2);
      expect(result.getMonth()).toBe(4); // May
    });

    test('Skips both holidays and weekends combined (Holy Week 2024)', () => {
      // Wednesday, March 27, 2024 + 2 business days
      // Skips Thursday 28 (Holy Thurs), Friday 29 (Good Fri), Sat 30, Sun 31.
      // Arrives at Monday, April 1, 2024.
      const start = new Date('2024-03-27T12:00:00');
      const result = addBusinessDays(start, 2);
      expect(result.getMonth()).toBe(3); // 0-indexed April
      expect(result.getDate()).toBe(2);
    });
  });
});
