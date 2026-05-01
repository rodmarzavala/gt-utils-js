export interface Holiday {
  date: Date;
  name: string;
  isMovable: boolean;
  originalDate?: Date; // If the holiday was moved, this is the original date
}

/**
 * Calculates Easter Sunday for a given year using the Computus algorithm.
 */
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed month
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Applies Decreto 19-2018 (and Constitutional Court ruling 2282-2020) rules for moving holidays.
 * Currently, only June 30th (Día del Ejército) is moved in Guatemala.
 * If it falls on Tuesday or Wednesday, it moves to the previous Monday.
 * If it falls on Thursday, Friday, Saturday, or Sunday, it moves to the next Monday.
 */
function moveHolidayIfApplicable(date: Date): Date {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  if (dayOfWeek === 2) {
    // Tuesday -> move to previous Monday
    return addDays(date, -1);
  } else if (dayOfWeek === 3) {
    // Wednesday -> move to previous Monday
    return addDays(date, -2);
  } else if (dayOfWeek === 4) {
    // Thursday -> move to next Monday
    return addDays(date, 4);
  } else if (dayOfWeek === 5) {
    // Friday -> move to next Monday
    return addDays(date, 3);
  } else if (dayOfWeek === 6) {
    // Saturday -> move to next Monday
    return addDays(date, 2);
  } else if (dayOfWeek === 0) {
    // Sunday -> move to next Monday
    return addDays(date, 1);
  }
  
  // Monday -> remains the same
  return new Date(date);
}

/**
 * Gets the list of national holidays for a given year in Guatemala.
 * Note: Local holidays like 'Día de la Asunción' (Aug 15 for Guatemala City) are not included by default
 * since they apply only to specific municipalities.
 * 
 * @param year The year to calculate holidays for.
 */
export function getHolidays(year: number): Holiday[] {
  const easterSunday = getEasterSunday(year);
  const juevesSanto = addDays(easterSunday, -3);
  const viernesSanto = addDays(easterSunday, -2);
  const sabadoSanto = addDays(easterSunday, -1);

  const holidays: Holiday[] = [
    { date: new Date(year, 0, 1), name: 'Año Nuevo', isMovable: false },
    { date: juevesSanto, name: 'Jueves Santo', isMovable: true },
    { date: viernesSanto, name: 'Viernes Santo', isMovable: true },
    { date: sabadoSanto, name: 'Sábado Santo', isMovable: true },
    { date: new Date(year, 4, 1), name: 'Día del Trabajo', isMovable: false },
  ];

  // Día del Ejército (June 30) is movable according to current law
  const diaEjercitoOriginal = new Date(year, 5, 30);
  const diaEjercitoMoved = moveHolidayIfApplicable(diaEjercitoOriginal);
  holidays.push({
    date: diaEjercitoMoved,
    name: 'Día del Ejército',
    isMovable: true,
    originalDate: diaEjercitoOriginal.getTime() !== diaEjercitoMoved.getTime() ? diaEjercitoOriginal : undefined
  });

  holidays.push(
    { date: new Date(year, 8, 15), name: 'Día de la Independencia', isMovable: false },
    { date: new Date(year, 9, 20), name: 'Día de la Revolución', isMovable: false },
    { date: new Date(year, 10, 1), name: 'Día de Todos los Santos', isMovable: false },
    { date: new Date(year, 11, 24), name: 'Nochebuena (Medio día)', isMovable: false },
    { date: new Date(year, 11, 25), name: 'Navidad', isMovable: false },
    { date: new Date(year, 11, 31), name: 'Víspera de Año Nuevo (Medio día)', isMovable: false }
  );

  // Sort chronologically
  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Checks if a given date is a national holiday in Guatemala.
 * @param date The date to check
 */
export function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getHolidays(year);
  
  return holidays.some(holiday => 
    holiday.date.getFullYear() === date.getFullYear() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getDate() === date.getDate()
  );
}

/**
 * Returns the next upcoming holiday starting from a given date (defaults to today).
 * @param fromDate The date to start searching from
 */
export function getNextHoliday(fromDate: Date = new Date()): Holiday {
  const year = fromDate.getFullYear();
  let holidays = getHolidays(year);
  
  // Filter for upcoming holidays in the current year
  // Strip time for proper full-day comparison
  const compareDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  
  let upcoming = holidays.filter(h => h.date >= compareDate);
  
  // If no more holidays this year, get the first one of next year
  if (upcoming.length === 0) {
    holidays = getHolidays(year + 1);
    upcoming = holidays;
  }
  
  return upcoming[0];
}
