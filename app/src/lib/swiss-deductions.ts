/**
 * Schweizer Sozialversicherungs- und Abzugsberechnungen
 * Kanton St. Gallen
 */

import { TAX_CONFIG } from './taxConfig';

export interface SwissDeductionsInput {
  grossSalaryCHF: number;
  yearlyGrossCHF: number;
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
  const { grossSalaryCHF, yearlyGrossCHF, age } = input;
  const config = TAX_CONFIG.switzerland;

  // AHV/IV/EO - aus Config
  const ahv = grossSalaryCHF * config.ahv.rate;

  // ALV - Arbeitslosenversicherung
  // Wichtig: Verwende yearlyGrossCHF für korrekte Berechnung bei 13/14 Monatsgehältern
  let alv: number;
  if (yearlyGrossCHF <= config.alv.yearlyLimit) {
    alv = grossSalaryCHF * config.alv.baseRate;
  } else {
    const overLimit = (yearlyGrossCHF - config.alv.yearlyLimit) / 12;
    alv = grossSalaryCHF * config.alv.baseRate + overLimit * config.alv.additionalRate;
  }

  // BVG - Berufliche Vorsorge (aus Config)
  let bvg = 0;
  if (age >= config.bvg.minAge && yearlyGrossCHF >= config.bvg.minYearlySalary) {
    bvg = grossSalaryCHF * config.bvg.rate;
  }

  // KTG - Krankentaggeldversicherung (aus Config)
  const ktg = grossSalaryCHF * config.ktg.rate;

  // NBU - Nichtberufsunfallversicherung (aus Config)
  const nbu = grossSalaryCHF * config.nbu.rate;

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
