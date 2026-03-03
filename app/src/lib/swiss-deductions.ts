/**
 * Schweizer Sozialversicherungs- und Abzugsberechnungen
 * Kanton St. Gallen
 */

import { TAX_CONFIG } from './taxConfig';

export interface SwissDeductionsInput {
  grossSalaryCHF: number;
  yearlyGrossCHF: number;
  age: number;
  
  // Optionale benutzerdefinierte Raten (überschreiben TAX_CONFIG)
  ahvRate?: number;
  alvRate?: number;
  bvgRate?: number;
  ktgRate?: number;
  nbuRate?: number;
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

  // Verwende benutzerdefinierte Raten oder Defaults aus Config
  const ahvRate = input.ahvRate ?? config.ahv.rate;
  const alvRate = input.alvRate ?? config.alv.baseRate;
  const bvgRate = input.bvgRate ?? config.bvg.rate;
  const ktgRate = input.ktgRate ?? config.ktg.rate;
  const nbuRate = input.nbuRate ?? config.nbu.rate;

  // AHV/IV/EO - mit konfigurierbarem Rate
  const ahv = grossSalaryCHF * ahvRate;

  // ALV - Arbeitslosenversicherung
  // Wichtig: Verwende yearlyGrossCHF für korrekte Berechnung bei 13/14 Monatsgehältern
  let alv: number;
  if (yearlyGrossCHF <= config.alv.yearlyLimit) {
    alv = grossSalaryCHF * alvRate;
  } else {
    const overLimit = (yearlyGrossCHF - config.alv.yearlyLimit) / 12;
    alv = grossSalaryCHF * alvRate + overLimit * config.alv.additionalRate;
  }

  // BVG - Berufliche Vorsorge (mit konfigurierbarem Rate)
  let bvg = 0;
  if (age >= config.bvg.minAge && yearlyGrossCHF >= config.bvg.minYearlySalary) {
    bvg = grossSalaryCHF * bvgRate;
  }

  // KTG - Krankentaggeldversicherung (mit konfigurierbarem Rate)
  const ktg = grossSalaryCHF * ktgRate;

  // NBU - Nichtberufsunfallversicherung (mit konfigurierbarem Rate)
  const nbu = grossSalaryCHF * nbuRate;

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
