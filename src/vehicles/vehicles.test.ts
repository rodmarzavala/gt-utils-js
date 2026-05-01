import { describe, expect, test, it } from 'vitest';
import { parseLicensePlate } from './index.js';

describe('Vehicles Module', () => {
  describe('parseLicensePlate', () => {
    test.each([
      // [Plate, ExpectedValid, Type, Number, Letters, Reason]
      ['P-123BCD', true, 'P', '123', 'BCD', 'Standard private plate'],
      ['P123BCD', true, 'P', '123', 'BCD', 'No hyphen private plate'],
      ['TC-001FGH', true, 'TC', '001', 'FGH', 'Two-letter type (Transporte Carga)'],
      ['M-999ZZZ', true, 'M', '999', 'ZZZ', 'Motorcycle with max numbers/letters'],
      ['A-12B', false, '', '', '', 'Missing letters (only 1)'],
      ['P-123BCE', false, 'P', '123', 'BCE', 'Contains vowel E at the end'],
      ['P-123ABC', false, 'P', '123', 'ABC', 'Contains vowel A at the start'],
      ['C-456XOY', false, 'C', '456', 'XOY', 'Contains vowel O in the middle'],
      ['XYZ-123', false, '', '', '', 'Completely wrong format (Letters first)'],
      ['P-1234BCDE', false, '', '', '', 'Too many letters (4)'],
    ])('Plate "%s" -> IsValid: %s (%s)', (plate, isValid, type, num, letters) => {
      const res = parseLicensePlate(plate);
      expect(res.isValid).toBe(isValid);
      if (isValid) {
        expect(res.type).toBe(type);
        expect(res.number).toBe(num);
        expect(res.letters).toBe(letters);
      }
    });
  });
});
