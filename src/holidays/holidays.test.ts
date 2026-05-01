import { describe, it, expect } from 'vitest';
import { getHolidays, isHoliday, getNextHoliday } from './index';

describe('Holidays Module', () => {
  it('should calculate holidays for 2024 correctly', () => {
    const holidays = getHolidays(2024);
    
    // Año Nuevo
    expect(holidays[0].name).toBe('Año Nuevo');
    expect(holidays[0].date.toISOString()).toContain('2024-01-01');

    // Semana Santa 2024 was end of March
    const juevesSanto = holidays.find(h => h.name === 'Jueves Santo');
    expect(juevesSanto?.date.toISOString()).toContain('2024-03-28');
    
    // Día del Ejército in 2024 fell on a Sunday (June 30).
    // According to law, it should be moved to Monday, July 1.
    const diaEjercito = holidays.find(h => h.name === 'Día del Ejército');
    expect(diaEjercito?.date.toISOString()).toContain('2024-07-01');
    expect(diaEjercito?.isMovable).toBe(true);
    expect(diaEjercito?.originalDate?.toISOString()).toContain('2024-06-30');
  });

  it('should calculate holidays for 2025 correctly', () => {
    const holidays = getHolidays(2025);
    
    // Semana Santa 2025 is in April
    const viernesSanto = holidays.find(h => h.name === 'Viernes Santo');
    expect(viernesSanto?.date.toISOString()).toContain('2025-04-18');
    
    // Día del Ejército in 2025 falls on a Monday (June 30).
    // Should stay on June 30.
    const diaEjercito = holidays.find(h => h.name === 'Día del Ejército');
    expect(diaEjercito?.date.toISOString()).toContain('2025-06-30');
    expect(diaEjercito?.originalDate).toBeUndefined();
  });

  it('isHoliday should correctly identify a holiday', () => {
    // 2024-01-01 is Año Nuevo
    expect(isHoliday(new Date(2024, 0, 1))).toBe(true);
    // 2024-01-02 is not
    expect(isHoliday(new Date(2024, 0, 2))).toBe(false);
    
    // 2024-07-01 is Día del Ejército (moved)
    expect(isHoliday(new Date(2024, 6, 1))).toBe(true);
    // 2024-06-30 was Sunday but moved, so technically not a day off, but is the original date.
    // Our function expects the applied off day to be the holiday.
    expect(isHoliday(new Date(2024, 5, 30))).toBe(false); 
  });

  it('getNextHoliday should return the upcoming holiday', () => {
    // Current date: Dec 26, 2024
    const next = getNextHoliday(new Date(2024, 11, 26));
    expect(next.name).toBe('Víspera de Año Nuevo (Medio día)');
    expect(next.date.toISOString()).toContain('2024-12-31');

    // Current date: Dec 31, 2024 -> should still return Dec 31 if exact same time is checked
    // because getNextHoliday strips time for comparison
    const sameDay = getNextHoliday(new Date(2024, 11, 31, 10, 0, 0));
    expect(sameDay.name).toBe('Víspera de Año Nuevo (Medio día)');
  });
});
