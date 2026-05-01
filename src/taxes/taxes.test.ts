import { describe, expect, test } from 'vitest';
import { calculateTaxes } from './index.js';

describe('Taxes Module', () => {
  describe('calculateTaxes', () => {
    test('Throws error for negative amounts', () => {
      expect(() => calculateTaxes({ amount: -100, regime: 'GENERAL', isRetentionAgent: false })).toThrowError();
    });

    test('Small Taxpayer (Pequeño Contribuyente)', () => {
      const res = calculateTaxes({ amount: 1000, regime: 'SMALL_TAXPAYER', isRetentionAgent: true });
      expect(res.subtotal).toBe(1000);
      expect(res.iva).toBe(0);
      expect(res.retentionIsr).toBe(0);
      expect(res.retentionIva).toBe(0);
      expect(res.totalToReceive).toBe(1000);
    });

    test('General Regime without Retention Agent', () => {
      // Amount 1120 means subtotal 1000, iva 120
      const res = calculateTaxes({ amount: 1120, regime: 'GENERAL', isRetentionAgent: false });
      expect(res.subtotal).toBe(1000);
      expect(res.iva).toBe(120);
      expect(res.retentionIsr).toBe(0);
      expect(res.retentionIva).toBe(0);
      expect(res.totalToReceive).toBe(1120);
    });

    test('General Regime with Retention Agent but below Q2,500 subtotal threshold', () => {
      // Amount 2240 means subtotal 2000, iva 240. Under 2500 subtotal, so no retentions apply.
      const res = calculateTaxes({ amount: 2240, regime: 'GENERAL', isRetentionAgent: true });
      expect(res.subtotal).toBe(2000);
      expect(res.iva).toBe(240);
      expect(res.retentionIsr).toBe(0);
      expect(res.retentionIva).toBe(0);
      expect(res.totalToReceive).toBe(2240);
    });

    test('General Regime with Retention Agent EXACTLY Q2,500 subtotal (retentions apply)', () => {
      // Amount 2800 -> subtotal 2500, iva 300
      const res = calculateTaxes({ amount: 2800, regime: 'GENERAL', isRetentionAgent: true });
      expect(res.subtotal).toBe(2500);
      expect(res.iva).toBe(300);
      
      // ISR = 2500 * 0.05 = 125
      expect(res.retentionIsr).toBe(125);
      
      // IVA Retention = 300 * 0.15 = 45
      expect(res.retentionIva).toBe(45);
      
      // Total to receive = 2800 - 125 - 45 = 2630
      expect(res.totalToReceive).toBe(2630);
    });

    test('General Regime with Retention Agent over Q30,000 subtotal (7% ISR logic)', () => {
      // Let's use subtotal 40000 -> amount 44800, iva 4800
      const res = calculateTaxes({ amount: 44800, regime: 'GENERAL', isRetentionAgent: true });
      expect(res.subtotal).toBe(40000);
      expect(res.iva).toBe(4800);
      
      // ISR = 1500 + ((40000 - 30000) * 0.07) = 1500 + 700 = 2200
      expect(res.retentionIsr).toBe(2200);
      
      // IVA Retention = 4800 * 0.15 = 720
      expect(res.retentionIva).toBe(720);
      
      // Total to receive = 44800 - 2200 - 720 = 41880
      expect(res.totalToReceive).toBe(41880);
    });

    test('Floating point precision handling', () => {
      // A common float issue number. Say amount is 15.55
      const res = calculateTaxes({ amount: 15.55, regime: 'GENERAL', isRetentionAgent: false });
      // 15.55 / 1.12 = 13.8839285714... -> rounded: 13.88
      // iva = 15.55 - 13.8839285714... = 1.6660714285... -> rounded: 1.67
      expect(res.subtotal).toBe(13.88);
      expect(res.iva).toBe(1.67);
    });
  });
});
