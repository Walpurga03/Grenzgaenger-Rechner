export interface IncomeInput {
  salaryCHF: number;
  bonusCHF: number;
  exchangeRate: number;
  is13thSalary: boolean;
}

export interface DeductionsCH {
  ahvRate: number;
  alvRate: number;
  bvgAmount: number;
  ktgAmount: number;
  sourceTaxSG: number;
}

export interface AllowancesAT {
  commuterFlatrate: number;  // Pendlerpauschale
  pensionerBonus: number;
  familyBonusPlus: number;
}

export interface CalculationResult {
  grossEUR: number;
  netCH: number;
  atTaxLiability: number;
  finalNetEUR: number;
}
