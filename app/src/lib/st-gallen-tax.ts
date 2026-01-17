/**
 * St. Gallen Quellensteuer für Grenzgänger
 * Vereinfachte Berechnung basierend auf Tarif G (Alleinstehend)
 */

import { TAX_CONFIG, getTaxRateForIncome } from './taxConfig';

export interface StGallenTaxInput {
  grossSalaryCHF: number; // Bruttolohn (Quellensteuer wird vom Brutto berechnet!)
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
  const { grossSalaryCHF, maritalStatus, children } = input;
  const yearlyGross = grossSalaryCHF * 12;

  // Hole Steuersatz aus Config
  const taxRate = getTaxRateForIncome(yearlyGross, maritalStatus);

  // Kinderabzug aus Config
  const childReduction = children * TAX_CONFIG.stGallen.childReduction;
  const adjustedRate = Math.max(0, taxRate - childReduction);

  const monthlySourceTax = grossSalaryCHF * adjustedRate;
  const netAfterTax = grossSalaryCHF - monthlySourceTax;

  return {
    sourceTax: monthlySourceTax,
    effectiveRate: adjustedRate,
    netAfterTax,
  };
}
