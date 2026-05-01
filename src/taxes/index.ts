export type TaxRegime = 'GENERAL' | 'SMALL_TAXPAYER';

export interface TaxOptions {
  amount: number;
  regime: TaxRegime;
  isRetentionAgent: boolean;
}

export interface TaxBreakdown {
  subtotal: number;
  iva: number;
  retentionIsr: number;
  retentionIva: number;
  totalToReceive: number;
}

/**
 * Calculates the tax breakdown for a given invoice amount in Guatemala.
 * Applies IVA (12%) and computes ISR and IVA retentions based on the regime
 * and whether the client is a retention agent.
 * 
 * Rules applied for 'GENERAL' regime over Q2,500 with a retention agent:
 * - IVA Retention: 15% of the calculated IVA.
 * - ISR Retention (Régimen Opcional Simplificado): 
 *   - 5% on the base amount up to Q30,000.
 *   - 7% on the excess over Q30,000 plus a fixed Q1,500.
 * 
 * @param options TaxOptions containing amount, regime, and retention agent flag
 * @returns TaxBreakdown object with exact calculated amounts
 */
export function calculateTaxes(options: TaxOptions): TaxBreakdown {
  const { amount, regime, isRetentionAgent } = options;

  if (amount < 0) {
    throw new Error('Amount cannot be negative');
  }

  // Small Taxpayer (Pequeño Contribuyente) does not break down IVA on invoices
  // However, for practical receipt calculation, we usually treat the amount as net.
  // In Guatemala, Pequeño Contribuyente invoices say "No genera derecho a crédito fiscal".
  // For the sake of this breakdown, subtotal = amount, iva = 0.
  if (regime === 'SMALL_TAXPAYER') {
    return {
      subtotal: amount,
      iva: 0,
      retentionIsr: 0, // In reality there's a 5% definite retention for small taxpayers if requested, but prompt focuses on General.
      retentionIva: 0,
      totalToReceive: amount,
    };
  }

  // General Regime
  // Base calculation (Amount without IVA)
  // Round to 2 decimal places to avoid floating point comparison issues (e.g. 2800 / 1.12 = 2499.9999999)
  const subtotal = Math.round((amount / 1.12) * 100) / 100;
  const iva = Math.round((amount - subtotal) * 100) / 100;

  let retentionIsr = 0;
  let retentionIva = 0;

  // Retentions apply only if the total invoice amount is greater than or equal to Q2,500
  // and the client is designated as a retention agent by SAT.
  // Note: Law says "greater than or equal to Q2,500 without IVA", wait. Actually Article 44 says "monto mayor a Q2,500.00 excluyendo el IVA".
  // So subtotal > 2500. Let's strictly use subtotal >= 2500 (Usually invoices of Q2,800 total have Q2,500 subtotal).
  if (isRetentionAgent && subtotal >= 2500) {
    // 15% IVA Retention
    retentionIva = iva * 0.15;

    // ISR Retention (Régimen Opcional Simplificado Sobre Ingresos)
    if (subtotal <= 30000) {
      retentionIsr = subtotal * 0.05;
    } else {
      retentionIsr = 1500 + ((subtotal - 30000) * 0.07);
    }
  }

  // Round values to 2 decimal places to avoid floating point precision issues
  const round2 = (num: number) => Math.round(num * 100) / 100;

  const finalSubtotal = round2(subtotal);
  const finalIva = round2(iva);
  const finalRetentionIsr = round2(retentionIsr);
  const finalRetentionIva = round2(retentionIva);
  
  // totalToReceive = amount - retentions
  const finalTotalToReceive = round2(amount - finalRetentionIsr - finalRetentionIva);

  return {
    subtotal: finalSubtotal,
    iva: finalIva,
    retentionIsr: finalRetentionIsr,
    retentionIva: finalRetentionIva,
    totalToReceive: finalTotalToReceive,
  };
}
