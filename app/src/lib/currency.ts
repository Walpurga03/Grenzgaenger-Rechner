/**
 * Währungsumrechnung CHF ↔ EUR
 */

import { TAX_CONFIG } from './taxConfig';

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
 * Holt den aktuellen EZB-Wechselkurs CHF → EUR
 * Verwendet die offizielle API der Europäischen Zentralbank
 */
export async function fetchExchangeRate(): Promise<number> {
  try {
    // Frankfurter API - nutzt EZB Daten, kostenlos, kein API Key nötig
    const response = await fetch('https://api.frankfurter.app/latest?from=CHF&to=EUR');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Die API liefert z.B.: { "rates": { "EUR": 0.95 } }
    if (data.rates && data.rates.EUR) {
      return data.rates.EUR;
    }
    
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Fehler beim Abrufen des Wechselkurses:', error);
    
    // Fallback aus Config
    return TAX_CONFIG.exchangeRate.defaultCHFtoEUR;
  }
}

/**
 * Validiert einen Wechselkurs
 */
export function validateExchangeRate(rate: number): boolean {
  const config = TAX_CONFIG.exchangeRate;
  return rate >= config.minValidRate && rate <= config.maxValidRate;
}
