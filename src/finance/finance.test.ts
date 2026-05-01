import { describe, expect, test, it } from 'vitest';
import { amountToWords, getBankFromAccount } from './index.js';

describe('Finance Module', () => {
  describe('amountToWords', () => {
    test.each([
      [150, 'CIENTO CINCUENTA QUETZALES EXACTOS'],
      [100, 'CIEN QUETZALES EXACTOS'],
      [25, 'VEINTICINCO QUETZALES EXACTOS'],
      [1005, 'MIL CINCO QUETZALES EXACTOS'],
      [150.50, 'CIENTO CINCUENTA QUETZALES CON 50/100 CENTAVOS'],
      [0.99, 'CERO QUETZALES CON 99/100 CENTAVOS'],
      [0, 'CERO QUETZALES EXACTOS'],
      [1000000, 'UN MILLON QUETZALES EXACTOS'],
      [2500500.25, 'DOS MILLONES QUINIENTOS MIL QUINIENTOS QUETZALES CON 25/100 CENTAVOS'],
    ] as [number, string][])('Amount %f translates to "%s"', (amount, expectedWords) => {
      expect(amountToWords(amount as number)).toBe(expectedWords);
    });

    it('throws on negative amounts', () => {
      expect(() => amountToWords(-10)).toThrow();
    });
  });

  describe('getBankFromAccount', () => {
    test.each([
      // [Account, ExpectedBank, ExpectedCode, Reason]
      ['3123456789', 'Banrural', 'BANRURAL', '10 digits starting with 3'],
      ['41234567891', 'Banrural', 'BANRURAL', '11 digits starting with 4'],
      ['0123456789', 'Banco Industrial', 'BI', '10 digits starting with 0'],
      ['1123456789', 'Banco Industrial', 'BI', '10 digits starting with 1'],
      ['01234567890123', 'Banco Industrial', 'BI', '14 digits IBAN style'],
      ['6123456789', 'BAM', 'BAM', '10 digits starting with 6'],
      ['5123456789', 'Banco Promerica', 'PROMERICA', '10 digits not matched by others'],
      ['123', null, null, 'Too short'],
      ['A123456789', null, null, 'Contains letters'],
    ] as [string, string | null, string | null, string][])('Account "%s" -> %s (%s)', (account, expectedBank, expectedCode) => {
      const res = getBankFromAccount(account);
      if (expectedBank === null) {
        expect(res).toBeNull();
      } else {
        expect(res?.bankName).toBe(expectedBank);
        expect(res?.bankCode).toBe(expectedCode);
      }
    });
  });
});
