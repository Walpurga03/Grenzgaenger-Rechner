/**
 * Währungsumrechnung CHF ↔ EUR
 */

export interface CurrencyConversion {
  amountCHF: number;
  amountEUR: number;
  rate: number;
}

/**
 * Rechnet CHF in EUR um
 */
export function convertCHFtoEUR(
  amountCHF: number,
  exchangeRate: number
): CurrencyConversion {
  const amountEUR = amountCHF * exchangeRate;
  
  return {
    amountCHF,
    amountEUR,
    rate: exchangeRate,
  };
}

/**
 * Rechnet EUR in CHF um
 */
export function convertEURtoCHF(
  amountEUR: number,
  exchangeRate: number
): CurrencyConversion {
  const amountCHF = amountEUR / exchangeRate;
  
  return {
    amountCHF,
    amountEUR,
    rate: exchangeRate,
  };
}

/**
 * Holt den aktuellen EZB-Wechselkurs (Fallback-Version)
 * In Produktion könnte hier eine echte API angebunden werden
 */
export async function fetchExchangeRate(): Promise<number> {
  // Fallback: Aktueller Durchschnittswert
  // In Zukunft: API-Call zu EZB oder anderen Quellen
  return 0.95; // 1 CHF = 0.95 EUR (ca. Wert)
}

/**
 * Validiert einen Wechselkurs
 */
export function validateExchangeRate(rate: number): boolean {
  // Realistischer Bereich für CHF/EUR: 0.85 - 1.05
  return rate >= 0.85 && rate <= 1.05;
}
