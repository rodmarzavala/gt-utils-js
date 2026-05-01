export type SeveranceReason = 'UNJUSTIFIED_FIRING' | 'RESIGNATION';

export interface SeveranceOptions {
  startDate: Date;
  endDate: Date;
  monthlySalary: number;
  reason: SeveranceReason;
}

export interface SeveranceBreakdown {
  aguinaldo: number;
  bono14: number;
  vacations: number;
  indemnizacion: number;
  totalToReceive: number;
  daysWorkedAguinaldo: number;
  daysWorkedBono14: number;
  daysWorkedVacations: number;
  totalDaysWorked: number;
}

/**
 * Calculates the difference in days between two dates (inclusive).
 */
function getDaysBetween(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  // Use UTC to ignore daylight saving time anomalies
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((utcEnd - utcStart) / msPerDay) + 1; // +1 because both start and end days are worked
}

/**
 * Finds the most recent specific date (month/day) before or on the target date.
 */
function getLastCutoffDate(targetDate: Date, cutoffMonth: number, cutoffDay: number): Date {
  const currentYear = targetDate.getFullYear();
  const candidate = new Date(currentYear, cutoffMonth, cutoffDay);
  if (candidate > targetDate) {
    candidate.setFullYear(currentYear - 1);
  }
  return candidate;
}

/**
 * Calculates Guatemalan severance (Liquidación Laboral).
 * 
 * Includes:
 * - Aguinaldo: Proportional from Dec 1.
 * - Bono 14: Proportional from Jul 1.
 * - Vacations: Proportional from the last anniversary.
 * - Indemnización: 14 salaries / 12 per year, proportional to total days worked (Only if unjustified firing).
 * 
 * @param options SeveranceOptions
 * @returns SeveranceBreakdown object
 */
export function calculateSeverance(options: SeveranceOptions): SeveranceBreakdown {
  const { startDate, endDate, monthlySalary, reason } = options;

  if (endDate < startDate) {
    throw new Error('End date cannot be before start date');
  }

  if (monthlySalary < 0) {
    throw new Error('Salary cannot be negative');
  }

  const totalDaysWorked = getDaysBetween(startDate, endDate);
  const dailySalary = monthlySalary / 365; // Base daily calculation for 365 days

  // 1. Aguinaldo (December 1 to November 30)
  // Cutoff is December 1. (Month 11 in JS Date, since 0-indexed)
  const lastAguinaldoCutoff = getLastCutoffDate(endDate, 11, 1);
  const aguinaldoStartDate = lastAguinaldoCutoff < startDate ? startDate : lastAguinaldoCutoff;
  const daysWorkedAguinaldo = getDaysBetween(aguinaldoStartDate, endDate);
  const aguinaldo = dailySalary * daysWorkedAguinaldo;

  // 2. Bono 14 (July 1 to June 30)
  // Cutoff is July 1. (Month 6 in JS Date)
  const lastBono14Cutoff = getLastCutoffDate(endDate, 6, 1);
  const bono14StartDate = lastBono14Cutoff < startDate ? startDate : lastBono14Cutoff;
  const daysWorkedBono14 = getDaysBetween(bono14StartDate, endDate);
  const bono14 = dailySalary * daysWorkedBono14;

  // 3. Vacations (Proportional from last anniversary)
  // 15 days of vacation per year. Value is 15 * (monthlySalary / 30) per year.
  // Formula: (monthlySalary / 30) * 15 * (days since anniversary / 365)
  const lastAnniversary = new Date(endDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  if (lastAnniversary > endDate) {
    lastAnniversary.setFullYear(lastAnniversary.getFullYear() - 1);
  }
  const daysWorkedVacations = getDaysBetween(lastAnniversary, endDate);
  const dailySalaryForVacations = monthlySalary / 30; // Labor code uses 30 days for vacation math
  const vacations = (dailySalaryForVacations * 15) * (daysWorkedVacations / 365);

  // 4. Indemnización (14 salaries rule per year, only if fired)
  let indemnizacion = 0;
  if (reason === 'UNJUSTIFIED_FIRING') {
    // Math: (monthlySalary * 14 / 12) per year worked
    const indemnizacionBase = (monthlySalary * 14) / 12;
    indemnizacion = (indemnizacionBase / 365) * totalDaysWorked;
  }

  const round2 = (num: number) => Math.round(num * 100) / 100;

  return {
    aguinaldo: round2(aguinaldo),
    bono14: round2(bono14),
    vacations: round2(vacations),
    indemnizacion: round2(indemnizacion),
    daysWorkedAguinaldo,
    daysWorkedBono14,
    daysWorkedVacations,
    totalDaysWorked,
    totalToReceive: round2(aguinaldo + bono14 + vacations + indemnizacion)
  };
}
