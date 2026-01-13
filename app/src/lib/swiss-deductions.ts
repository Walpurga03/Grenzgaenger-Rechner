/**
 * Schweizer Sozialversicherungs- und Abzugsberechnungen
 * Kanton St. Gallen
 */

export interface SwissDeductionsInput {
  grossSalaryCHF: number;
  age: number;
}

export interface SwissDeductionsResult {
  ahv: number;           // Alters- und Hinterlassenenversicherung
  alv: number;           // Arbeitslosenversicherung
  bvg: number;           // Berufliche Vorsorge (Pensionskasse)
  ktg: number;           // Krankentaggeldversicherung
  nbu: number;           // Nichtberufsunfallversicherung
  totalDeductions: number;
  netSalaryCHF: number;
}

/**
 * Berechnet die Schweizer Sozialversicherungsabzüge
 */
export function calculateSwissDeductions(
  input: SwissDeductionsInput
): SwissDeductionsResult {
  const { grossSalaryCHF, age } = input;

  // AHV/IV/EO - 5.3% (Arbeitnehmeranteil)
  const ahv = grossSalaryCHF * 0.053;

  // ALV - Arbeitslosenversicherung
  // Bis CHF 148'200: 1.1%
  // Über CHF 148'200: zusätzlich 0.5% auf den Mehrbetrag
  let alv: number;
  const alvLimit = 148200;
  const monthlyGross = grossSalaryCHF;
  const yearlyGross = monthlyGross * 12;

  if (yearlyGross <= alvLimit) {
    alv = monthlyGross * 0.011;
  } else {
    const overLimit = (yearlyGross - alvLimit) / 12;
    alv = monthlyGross * 0.011 + overLimit * 0.005;
  }

  // BVG - Berufliche Vorsorge (durchschnittlich 6-8%, hier 7%)
  // Gilt ab 18 Jahren und ab CHF 22'050 Jahreslohn
  let bvg = 0;
  if (age >= 18 && yearlyGross >= 22050) {
    bvg = grossSalaryCHF * 0.07;
  }

  // KTG - Krankentaggeldversicherung (ca. 1.4%)
  const ktg = grossSalaryCHF * 0.014;

  // NBU - Nichtberufsunfallversicherung (ca. 1%)
  const nbu = grossSalaryCHF * 0.01;

  const totalDeductions = ahv + alv + bvg + ktg + nbu;
  const netSalaryCHF = grossSalaryCHF - totalDeductions;

  return {
    ahv,
    alv,
    bvg,
    ktg,
    nbu,
    totalDeductions,
    netSalaryCHF,
  };
}
