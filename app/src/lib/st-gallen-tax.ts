/**
 * St. Gallen Quellensteuer für Grenzgänger
 * Vereinfachte Berechnung basierend auf Tarif G (Alleinstehend)
 */

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

  // Vereinfachte Steuertarife für SG (Tarif G - Grenzgänger)
  // Diese sind Näherungswerte und sollten mit aktuellen Tarifen abgeglichen werden
  let taxRate: number;

  if (maritalStatus === 'single') {
    if (yearlyNet <= 20000) {
      taxRate = 0.00;
    } else if (yearlyNet <= 40000) {
      taxRate = 0.02;
    } else if (yearlyNet <= 60000) {
      taxRate = 0.04;
    } else if (yearlyNet <= 80000) {
      taxRate = 0.06;
    } else if (yearlyNet <= 100000) {
      taxRate = 0.08;
    } else {
      taxRate = 0.10;
    }
  } else {
    // Verheiratet - niedrigere Steuersätze
    if (yearlyNet <= 30000) {
      taxRate = 0.00;
    } else if (yearlyNet <= 50000) {
      taxRate = 0.015;
    } else if (yearlyNet <= 70000) {
      taxRate = 0.03;
    } else if (yearlyNet <= 90000) {
      taxRate = 0.05;
    } else if (yearlyNet <= 110000) {
      taxRate = 0.07;
    } else {
      taxRate = 0.09;
    }
  }

  // Kinderabzug (ca. 0.5% Reduktion pro Kind)
  const childReduction = children * 0.005;
  const adjustedRate = Math.max(0, taxRate - childReduction);

  const monthlySourceTax = netSalaryCHF * adjustedRate;
  const netAfterTax = netSalaryCHF - monthlySourceTax;

  return {
    sourceTax: monthlySourceTax,
    effectiveRate: adjustedRate,
    netAfterTax,
  };
}
