import { describe, expect, test } from 'vitest';
import { calculateSeverance } from './index.js';

describe('Labor Module', () => {
  describe('calculateSeverance', () => {
    test('Throws error for invalid dates', () => {
      expect(() => calculateSeverance({
        startDate: new Date('2024-01-01'),
        endDate: new Date('2023-01-01'),
        monthlySalary: 3000,
        reason: 'RESIGNATION'
      })).toThrowError();
    });

    test('Calculates proportional Aguinaldo, Bono14, Vacations correctly for exactly 1 year of work', () => {
      // Worked exactly 1 year: Jan 1, 2023 to Dec 31, 2023. (365 days)
      const res = calculateSeverance({
        startDate: new Date('2023-01-01T12:00:00Z'),
        endDate: new Date('2023-12-31T12:00:00Z'),
        monthlySalary: 3000,
        reason: 'RESIGNATION'
      });

      // Aguinaldo: Dec 1, 2023 to Dec 31, 2023 = 31 days
      // (3000 / 365) * 31 = 254.79
      expect(res.daysWorkedAguinaldo).toBe(31);
      expect(res.aguinaldo).toBe(254.79);

      // Bono 14: Jul 1, 2023 to Dec 31, 2023 = 184 days
      // (3000 / 365) * 184 = 1512.33
      expect(res.daysWorkedBono14).toBe(184);
      expect(res.bono14).toBe(1512.33);

      // Vacations: Since anniversary is Jan 1, the period from Jan 1 to Dec 31 is exactly 365 days.
      // (3000/30) * 15 * (365/365) = 100 * 15 * 1 = 1500
      expect(res.daysWorkedVacations).toBe(365);
      expect(res.vacations).toBe(1500);

      // Resignation = 0 Indemnización
      expect(res.indemnizacion).toBe(0);
      expect(res.totalToReceive).toBe(254.79 + 1512.33 + 1500 + 0);
    });

    test('Calculates Indemnización on Unjustified Firing', () => {
      // Worked exactly 1 year: Jan 1, 2023 to Dec 31, 2023.
      const res = calculateSeverance({
        startDate: new Date('2023-01-01T12:00:00Z'),
        endDate: new Date('2023-12-31T12:00:00Z'),
        monthlySalary: 3000,
        reason: 'UNJUSTIFIED_FIRING'
      });

      // Indemnización: Base = 3000 * 14 / 12 = 3500. 
      // Worked 365 days: (3500 / 365) * 365 = 3500.
      expect(res.totalDaysWorked).toBe(365);
      expect(res.indemnizacion).toBe(3500);
      expect(res.totalToReceive).toBeGreaterThan(3500);
    });

    test('Short period calculation', () => {
      // Nov 15 to Dec 15 (31 days)
      const res = calculateSeverance({
        startDate: new Date('2023-11-15T12:00:00Z'),
        endDate: new Date('2023-12-15T12:00:00Z'),
        monthlySalary: 3000,
        reason: 'RESIGNATION'
      });

      expect(res.totalDaysWorked).toBe(31);
      
      // Aguinaldo: Started before Dec 1. From Dec 1 to Dec 15 = 15 days.
      expect(res.daysWorkedAguinaldo).toBe(15);
      
      // Bono 14: Started after Jul 1. From Nov 15 to Dec 15 = 31 days.
      expect(res.daysWorkedBono14).toBe(31);
      
      // Vacations: Since anniversary (Nov 15). From Nov 15 to Dec 15 = 31 days.
      expect(res.daysWorkedVacations).toBe(31);
    });
  });
});
