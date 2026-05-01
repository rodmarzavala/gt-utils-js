import { isHoliday } from '../holidays/index.js';
export { isHoliday };

/**
 * Adds a specific number of business days to a start date.
 * Skips weekends (Saturday and Sunday) and Guatemalan national holidays.
 * 
 * @param startDate The date to start counting from
 * @param daysToAdd Number of business days to add
 * @returns The resulting Date
 */
export function addBusinessDays(startDate: Date, daysToAdd: number): Date {
  const result = new Date(startDate);
  
  // Normalize hours to avoid DST crossing issues
  result.setHours(12, 0, 0, 0);

  let addedDays = 0;
  const direction = daysToAdd > 0 ? 1 : -1;
  const limit = Math.abs(daysToAdd);

  while (addedDays < limit) {
    result.setDate(result.getDate() + direction);
    
    const dayOfWeek = result.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
    
    if (!isWeekend && !isHoliday(result)) {
      addedDays++;
    }
  }

  // Restore to original hours if possible, though business days usually just care about the date part.
  return result;
}
