export interface LicensePlateResult {
  isValid: boolean;
  type: string;
  number: string;
  letters: string;
}

/**
 * Validates and parses a Guatemalan license plate.
 * Examples: P-123ABC, P123ABC.
 * Guatemalan regulations prohibit vowels in the final 3-letter block.
 */
export function parseLicensePlate(plate: string): LicensePlateResult {
  const defaultResult: LicensePlateResult = {
    isValid: false,
    type: "",
    number: "",
    letters: ""
  };

  if (!plate) return defaultResult;

  const normalizedPlate = plate.toUpperCase().trim();
  const regex = /^([A-Z]{1,2})-?(\d{1,4})([A-Z]{3})$/;

  const match = normalizedPlate.match(regex);

  if (!match) {
    return defaultResult;
  }

  const type = match[1];
  const number = match[2];
  const letters = match[3];

  // Guatemalan law prohibits the use of vowels in the suffix to avoid forming words.
  const hasVowels = /[AEIOU]/.test(letters);

  if (hasVowels) {
    return {
      isValid: false,
      type,
      number,
      letters
    };
  }

  return {
    isValid: true,
    type,
    number,
    letters
  };
}
