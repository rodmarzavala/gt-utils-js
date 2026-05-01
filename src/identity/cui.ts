import { departments } from '../geo/departments';

export interface CuiInformation {
  isValid: boolean;
  department?: string;
  municipalityId?: number;
}

export function isValidCui(cui: string): boolean {
  if (!cui) return false;

  const normalizedCui = cui.replace(/[\s-]/g, '');

  if (!/^\d{13}$/.test(normalizedCui)) {
    return false;
  }

  const numberPart = normalizedCui.substring(0, 8);
  const verifier = parseInt(normalizedCui.substring(8, 9), 10);
  const departmentId = parseInt(normalizedCui.substring(9, 11), 10);
  const municipalityId = parseInt(normalizedCui.substring(11, 13), 10);

  // Validate department (1-22)
  const department = departments.find(d => d.id === departmentId);
  if (!department) {
    return false;
  }

  // Validate municipality bounds per department
  if (municipalityId < 1 || (department.municipalityCount && municipalityId > department.municipalityCount)) {
    return false;
  }

  // Checksum calculation using Modulo 11
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const digit = parseInt(numberPart[i], 10);
    const multiplier = i + 2; // 2, 3, 4, 5, 6, 7, 8, 9
    sum += digit * multiplier;
  }

  const calculatedVerifier = sum % 11;

  return calculatedVerifier === verifier;
}

/**
 * Parses a CUI and returns the geographical information derived from its trailing digits.
 * @param cui The CUI (DPI number) to inspect.
 */
export function getCuiInformation(cui: string): CuiInformation {
  if (!isValidCui(cui)) {
    return { isValid: false };
  }

  const normalizedCui = cui.replace(/[\s-]/g, '');
  const departmentId = parseInt(normalizedCui.substring(9, 11), 10);
  const municipalityId = parseInt(normalizedCui.substring(11, 13), 10);

  const department = departments.find(d => d.id === departmentId);

  return {
    isValid: true,
    department: department?.name,
    municipalityId
  };
}
