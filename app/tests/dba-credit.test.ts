import { describe, it, expect } from 'vitest';
import { calculateCreditableSourceTax } from '../src/lib/austrian-tax';

describe('DBA-Anrechnung (4,5%-Kappung)', () => {
  it('sollte bei 5,83% Quellensteuer nur 4,5% anrechnen (Lohnabrechnung Moik)', () => {
    // Reales Beispiel: Alexander Moik, Februar 2026
    const grossIncomeEUR = 6586.65; // 6333.70 CHF × 1.04
    const actualSourceTaxEUR = 384.02; // 369.25 CHF × 1.04 (5,83%)
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    // Erwartete Werte
    const expectedCreditable = grossIncomeEUR * 0.045; // 296.40 EUR
    const expectedNonCreditable = actualSourceTaxEUR - expectedCreditable; // 87.62 EUR
    
    expect(result.creditable).toBeCloseTo(expectedCreditable, 2);
    expect(result.nonCreditable).toBeCloseTo(expectedNonCreditable, 2);
    expect(result.leakagePercent).toBeCloseTo(1.33, 2); // 1,33%
  });
  
  it('sollte bei niedriger Quellensteuer (<4,5%) alles anrechnen', () => {
    const grossIncomeEUR = 5000;
    const actualSourceTaxEUR = 200; // 4% (unter 4,5%)
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    expect(result.creditable).toBe(200);
    expect(result.nonCreditable).toBe(0);
    expect(result.leakagePercent).toBe(0);
  });
  
  it('sollte bei hoher Quellensteuer (>4,5%) korrekt kappen', () => {
    const grossIncomeEUR = 8000;
    const actualSourceTaxEUR = 560; // 7% (deutlich über 4,5%)
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    const expectedCreditable = 8000 * 0.045; // 360 EUR
    const expectedNonCreditable = 560 - 360; // 200 EUR
    
    expect(result.creditable).toBe(expectedCreditable);
    expect(result.nonCreditable).toBe(expectedNonCreditable);
    expect(result.leakagePercent).toBeCloseTo(2.5, 2); // 2,5%
  });
  
  it('sollte bei exakt 4,5% Quellensteuer keinen Verlust haben', () => {
    const grossIncomeEUR = 10000;
    const actualSourceTaxEUR = 450; // Exakt 4,5%
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    expect(result.creditable).toBe(450);
    expect(result.nonCreditable).toBe(0);
    expect(result.leakagePercent).toBe(0);
  });
  
  it('sollte bei 0 EUR Brutto keinen Fehler werfen', () => {
    const grossIncomeEUR = 0;
    const actualSourceTaxEUR = 0;
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    expect(result.creditable).toBe(0);
    expect(result.nonCreditable).toBe(0);
    expect(result.leakagePercent).toBe(0);
  });
  
  it('sollte bei sehr hohem Einkommen korrekt rechnen', () => {
    const grossIncomeEUR = 100000; // 100k EUR/Jahr
    const actualSourceTaxEUR = 6000; // 6% Quellensteuer
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    const expectedCreditable = 100000 * 0.045; // 4.500 EUR
    const expectedNonCreditable = 6000 - 4500; // 1.500 EUR
    
    expect(result.creditable).toBe(expectedCreditable);
    expect(result.nonCreditable).toBe(expectedNonCreditable);
    expect(result.leakagePercent).toBeCloseTo(1.5, 2); // 1,5%
  });
  
  it('sollte Jahreswerte korrekt berechnen (12 Monate)', () => {
    // Monatswerte
    const monthlyGrossEUR = 6586.65;
    const monthlySourceTaxEUR = 384.02;
    
    // Jahreswerte
    const yearlyGrossEUR = monthlyGrossEUR * 12; // 79.039,80 EUR
    const yearlySourceTaxEUR = monthlySourceTaxEUR * 12; // 4.608,24 EUR
    
    const result = calculateCreditableSourceTax(yearlyGrossEUR, yearlySourceTaxEUR);
    
    const expectedCreditable = yearlyGrossEUR * 0.045; // 3.556,79 EUR
    const expectedNonCreditable = yearlySourceTaxEUR - expectedCreditable; // 1.051,45 EUR
    
    expect(result.creditable).toBeCloseTo(expectedCreditable, 2);
    expect(result.nonCreditable).toBeCloseTo(expectedNonCreditable, 2);
    expect(result.leakagePercent).toBeCloseTo(1.33, 2);
  });
});

describe('DBA-Anrechnung: Edge Cases', () => {
  it('sollte negative Werte korrekt behandeln (sollte nicht vorkommen)', () => {
    const grossIncomeEUR = 5000;
    const actualSourceTaxEUR = -100; // Negativ (sollte nicht vorkommen)
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    // Bei negativer Quellensteuer: Math.min(-100, 225) = -100
    // creditable = -100, nonCreditable = -100 - (-100) = 0
    expect(result.creditable).toBe(-100);
    expect(result.nonCreditable).toBe(0);
    expect(result.leakagePercent).toBe(0);
  });
  
  it('sollte sehr kleine Beträge korrekt runden', () => {
    const grossIncomeEUR = 100;
    const actualSourceTaxEUR = 5; // 5%
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    const expectedCreditable = 100 * 0.045; // 4.50 EUR
    const expectedNonCreditable = 5 - 4.5; // 0.50 EUR
    
    expect(result.creditable).toBeCloseTo(expectedCreditable, 2);
    expect(result.nonCreditable).toBeCloseTo(expectedNonCreditable, 2);
    expect(result.leakagePercent).toBeCloseTo(0.5, 2);
  });
});

describe('DBA-Anrechnung: Realistische Szenarien', () => {
  it('Niedriglohn-Szenario (5.000 CHF)', () => {
    const grossIncomeEUR = 5200; // 5000 CHF × 1.04
    const actualSourceTaxEUR = 280; // ~5,4% Quellensteuer
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    const expectedCreditable = 5200 * 0.045; // 234 EUR
    const expectedNonCreditable = 280 - 234; // 46 EUR
    
    expect(result.creditable).toBeCloseTo(expectedCreditable, 2);
    expect(result.nonCreditable).toBeCloseTo(expectedNonCreditable, 2);
    expect(result.leakagePercent).toBeCloseTo(0.88, 2);
  });
  
  it('Hochlohn-Szenario (8.000 CHF)', () => {
    const grossIncomeEUR = 8320; // 8000 CHF × 1.04
    const actualSourceTaxEUR = 520; // ~6,25% Quellensteuer
    
    const result = calculateCreditableSourceTax(grossIncomeEUR, actualSourceTaxEUR);
    
    const expectedCreditable = 8320 * 0.045; // 374.40 EUR
    const expectedNonCreditable = 520 - 374.40; // 145.60 EUR
    
    expect(result.creditable).toBeCloseTo(expectedCreditable, 2);
    expect(result.nonCreditable).toBeCloseTo(expectedNonCreditable, 2);
    expect(result.leakagePercent).toBeCloseTo(1.75, 2);
  });
  
  it('Jahresberechnung mit 13. Gehalt', () => {
    const monthlyGrossEUR = 6586.65;
    const yearlyGrossEUR = monthlyGrossEUR * 13; // 85.626,45 EUR
    const yearlySourceTaxEUR = (monthlyGrossEUR * 0.0583) * 13; // ~4.992,90 EUR
    
    const result = calculateCreditableSourceTax(yearlyGrossEUR, yearlySourceTaxEUR);
    
    const expectedCreditable = yearlyGrossEUR * 0.045; // 3.853,19 EUR
    const expectedNonCreditable = yearlySourceTaxEUR - expectedCreditable;
    
    expect(result.creditable).toBeCloseTo(expectedCreditable, 2);
    expect(result.nonCreditable).toBeCloseTo(expectedNonCreditable, 2);
  });
});
