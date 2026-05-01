export interface BankInfo {
  bankName: string;
  bankCode: string;
}

/**
 * Deduce the typical Guatemalan bank based on account format heuristics.
 * Note: These are heuristic patterns based on common lengths and prefixes.
 * They are not guaranteed as banks may issue new prefixes or lengths.
 */
export function getBankFromAccount(account: string): BankInfo | null {
  if (!account) return null;

  const normalizedAccount = account.replace(/\D/g, '');

  if (normalizedAccount.length === 0) return null;

  // Banrural: typically 10 or 11 digits, commonly starts with 3 or 4
  if ((normalizedAccount.length === 10 || normalizedAccount.length === 11) && /^[34]/.test(normalizedAccount)) {
    return { bankName: 'Banrural', bankCode: 'BANRURAL' };
  }

  // Banco Industrial (BI): typically 10 digits starting with 0, 1, 2 or 14 digits for IBANs
  if ((normalizedAccount.length === 10 && /^[012]/.test(normalizedAccount)) || normalizedAccount.length === 14) {
    return { bankName: 'Banco Industrial', bankCode: 'BI' };
  }

  // G&T Continental: typically 10 digits starting with 0
  // Note: Can overlap with BI; heuristic favors G&T for specific legacy formats
  if (normalizedAccount.length === 10 && /^0[0-9]{9}$/.test(normalizedAccount)) {
    return { bankName: 'G&T Continental', bankCode: 'GYT' };
  }

  // BAM: typically 10 digits, some starting with 4 or 6
  if (normalizedAccount.length === 10 && /^[46]/.test(normalizedAccount)) {
    return { bankName: 'BAM', bankCode: 'BAM' };
  }

  // Promerica: typically 10 or 11 digits
  if (normalizedAccount.length === 10 || normalizedAccount.length === 11) {
    return { bankName: 'Banco Promerica', bankCode: 'PROMERICA' };
  }

  return null;
}
