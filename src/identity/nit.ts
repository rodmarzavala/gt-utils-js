import { isValidCui } from './cui.js';

export function isValidNit(nit: string): boolean {
  if (!nit) return false;

  const normalizedNit = nit.replace(/[\s-]/g, '').toUpperCase();

  // If it's a 13 digit number, the SAT 2025 rule accepts valid CUIs as NITs.
  if (/^\d{13}$/.test(normalizedNit)) {
    return isValidCui(normalizedNit);
  }

  // Traditional NIT format check
  if (!/^[0-9]+[0-9K]$/.test(normalizedNit)) {
    return false;
  }

  const numberPart = normalizedNit.substring(0, normalizedNit.length - 1);
  const expectedVerifier = normalizedNit.substring(normalizedNit.length - 1);

  let sum = 0;
  const length = numberPart.length;

  for (let i = 0; i < length; i++) {
    const digit = parseInt(numberPart[i], 10);
    const multiplier = length + 1 - i;
    sum += digit * multiplier;
  }

  const remainder = sum % 11;
  const difference = 11 - remainder;

  let calculatedVerifier = difference.toString();

  if (difference === 11) {
    calculatedVerifier = '0';
  } else if (difference === 10) {
    calculatedVerifier = 'K';
  }

  return calculatedVerifier === expectedVerifier;
}
