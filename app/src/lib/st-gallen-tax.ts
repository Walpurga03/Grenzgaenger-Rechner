/**
 * St. Gallen Quellensteuer für Grenzgänger
 * Vereinfachte Berechnung basierend auf Tarif G (Alleinstehend)
 */

import { TAX_CONFIG, getTaxRateForIncome } from './taxConfig';

export interface StGallenTaxInput {
  netSalaryCHF: number;
  maritalStatus: 'single' | 'married';
  children: number;
}

export interface StGallenTaxResult {
  sourceTax: number;
  effectiveRate: number;
  netAfterTax: number;
}

/**
 * Berechnet die Quellensteuer für Kanton St. Gallen
 * Vereinfachte progressive Steuerberechnung
 */
export function calculateStGallenTax(
  input: StGallenTaxInput
): StGallenTaxResult {
  const { netSalaryCHF, maritalStatus, children } = input;
  const yearlyNet = netSalaryCHF * 12;

  // Hole Steuersatz aus Config
  const taxRate = getTaxRateForIncome(yearlyNet, maritalStatus);

  // Kinderabzug aus Config
  const childReduction = children * TAX_CONFIG.stGallen.childReduction;
  const adjustedRate = Math.max(0, taxRate - childReduction);

  const monthlySourceTax = netSalaryCHF * adjustedRate;
  const netAfterTax = netSalaryCHF - monthlySourceTax;

  return {
    sourceTax: monthlySourceTax,
    effectiveRate: adjustedRate,
    netAfterTax,
  };
}
