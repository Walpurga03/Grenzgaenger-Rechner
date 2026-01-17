/**
 * Schweizer Sozialversicherungs- und Abzugsberechnungen
 * Kanton St. Gallen
 */

import { TAX_CONFIG } from './taxConfig';

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
  const config = TAX_CONFIG.switzerland;

  // AHV/IV/EO - aus Config
  const ahv = grossSalaryCHF * config.ahv.rate;

  // ALV - Arbeitslosenversicherung
  const monthlyGross = grossSalaryCHF;
  const yearlyGross = monthlyGross * 12;
  
  let alv: number;
  if (yearlyGross <= config.alv.yearlyLimit) {
    alv = monthlyGross * config.alv.baseRate;
  } else {
    const overLimit = (yearlyGross - config.alv.yearlyLimit) / 12;
    alv = monthlyGross * config.alv.baseRate + overLimit * config.alv.additionalRate;
  }

  // BVG - Berufliche Vorsorge (aus Config)
  let bvg = 0;
  if (age >= config.bvg.minAge && yearlyGross >= config.bvg.minYearlySalary) {
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
