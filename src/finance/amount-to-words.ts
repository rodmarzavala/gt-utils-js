/**
 * Converts a numeric amount to its Spanish legal text representation for accounting/billing in Guatemala.
 * e.g., 150 -> "CIENTO CINCUENTA QUETZALES EXACTOS"
 * e.g., 150.50 -> "CIENTO CINCUENTA QUETZALES CON 50/100 CENTAVOS"
 */
export function amountToWords(amount: number): string {
  if (amount < 0) throw new Error("Amount must be positive");
  if (amount === 0) return "CERO QUETZALES EXACTOS";

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  const integerWords = integerPart === 0 ? "CERO" : toWords(integerPart);
  
  let result = `${integerWords} QUETZALES`;

  if (decimalPart === 0) {
    result += " EXACTOS";
  } else {
    const formattedCents = decimalPart.toString().padStart(2, '0');
    result += ` CON ${formattedCents}/100 CENTAVOS`;
  }

  return result.trim();
}

function toWords(num: number): string {
  if (num === 0) return "";

  const units = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "VEINTIUNO", "VEINTIDOS", "VEINTITRES", "VEINTICUATRO", "VEINTICINCO", "VEINTISEIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
  const tens = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  const hundreds = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

  if (num === 100) return "CIEN";

  if (num < 30) return units[num];

  if (num < 100) {
    const unit = num % 10;
    return tens[Math.floor(num / 10)] + (unit > 0 ? ` Y ${units[unit]}` : "");
  }

  if (num < 1000) {
    const remainder = num % 100;
    return hundreds[Math.floor(num / 100)] + (remainder > 0 ? ` ${toWords(remainder)}` : "");
  }

  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandText = thousands === 1 ? "MIL" : `${toWords(thousands)} MIL`;
    return thousandText + (remainder > 0 ? ` ${toWords(remainder)}` : "");
  }

  if (num < 1000000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    const millionText = millions === 1 ? "UN MILLON" : `${toWords(millions)} MILLONES`;
    return millionText + (remainder > 0 ? ` ${toWords(remainder)}` : "");
  }

  return num.toString();
}
