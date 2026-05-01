import { describe, expect, test } from 'vitest';
import { isValidNit, isValidCui } from './index.js';

describe('Identity Module', () => {
  describe('isValidCui (DPI)', () => {
    test.each([
      // [CUI, ExpectedResult, Reason]
      ['1234567890101', true, 'Valid 13-digit CUI mathematically'],
      ['1234567830101', false, 'Invalid Checksum (9th digit)'],
      ['1234567822301', false, 'Invalid Department (23 does not exist)'],
      ['1234567820100', false, 'Invalid Municipality (00 does not exist)'],
      ['12345678201', false, 'Too short (11 digits)'],
      ['12345678201011', false, 'Too long (14 digits)'],
      ['A234567820101', false, 'Contains letters'],
      ['', false, 'Empty string'],
    ])('CUI "%s" -> %s (%s)', (cui, expected) => {
      expect(isValidCui(cui)).toBe(expected);
    });
  });

  describe('isValidNit', () => {
    test.each([
      // [NIT, ExpectedResult, Reason]
      ['123456-0', true, 'Traditional NIT with correct Modulo 11'],
      ['1234560', true, 'Traditional NIT without hyphen'],
      ['12345-5', true, 'Traditional NIT 5 digits correct Modulo 11'],
      ['123456-1', false, 'Traditional NIT with wrong verifier'],
      ['12345-K', false, 'Traditional NIT wrong verifier K'],
      ['1234567890101', true, 'SAT 2025: 13-digit valid CUI acts as NIT'],
      ['1234567830101', false, 'SAT 2025: 13-digit invalid CUI is rejected'],
      ['A23456-0', false, 'Contains letters in numeric part'],
      ['-', false, 'Just a hyphen'],
    ])('NIT "%s" -> %s (%s)', (nit, expected) => {
      expect(isValidNit(nit)).toBe(expected);
    });
  });
});
