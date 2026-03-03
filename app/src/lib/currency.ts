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
    console.log('Fetching exchange rate from Frankfurter API...');
    
    // Frankfurter API - nutzt EZB Daten, kostenlos, kein API Key nötig
    const response = await fetch('https://api.frankfurter.app/latest?from=CHF&to=EUR', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    // Die API liefert z.B.: { "amount": 1.0, "base": "CHF", "date": "2026-03-02", "rates": { "EUR": 1.0969 } }
    if (data.rates && data.rates.EUR) {
      const rate = data.rates.EUR;
      console.log('Exchange rate fetched successfully:', rate);
      return rate;
    }
    
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Fehler beim Abrufen des Wechselkurses:', error);
    console.log('Using fallback rate from config:', TAX_CONFIG.exchangeRate.defaultCHFtoEUR);
    
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
