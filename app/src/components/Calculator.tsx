import { useState, useMemo, useEffect } from 'react';
import { calculateGrenzgaenger, type GrenzgaengerInput } from '@/lib/calculator';
import { fetchExchangeRate } from '@/lib/currency';
import { InfoButton } from './InfoButton';
import { InfoModal } from './InfoModal';
import { helpTexts } from '@/lib/helpTexts';
import { RefreshCw } from 'lucide-react';

export function Calculator() {
  // State für alle Eingabewerte
  const [grossSalary, setGrossSalary] = useState<number>(6500);
  const [exchangeRate, setExchangeRate] = useState<number>(0.95);
  const [salaryMonths, setSalaryMonths] = useState<12 | 13 | 14>(12);
  const [age, setAge] = useState<number>(30);
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');
  const [children, setChildren] = useState<number>(0);
  const [commuterAllowance, setCommuterAllowance] = useState<number>(200);
  const [familyBonus, setFamilyBonus] = useState<number>(125);
  const [pensionerBonus, setPensionerBonus] = useState<number>(0);

  // State für Info-Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // State für Wechselkurs-Laden
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(false);
  const [rateLastUpdated, setRateLastUpdated] = useState<Date | null>(null);

  // Wechselkurs beim Start automatisch laden
  useEffect(() => {
    loadExchangeRate();
  }, []);

  // Funktion zum Laden des aktuellen Wechselkurses
  const loadExchangeRate = async () => {
    setIsLoadingRate(true);
    try {
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setRateLastUpdated(new Date());
    } catch (error) {
      console.error('Fehler beim Laden des Wechselkurses', error);
    } finally {
      setIsLoadingRate(false);
    }
  };

  // Memoized Berechnung - nur neu berechnen wenn sich Inputs ändern
  const result = useMemo(() => {
    const input: GrenzgaengerInput = {
      grossSalaryCHF: grossSalary,
      salaryMonthsPerYear: salaryMonths,
      age,
      maritalStatus,
      children,
      commuterAllowanceEUR: commuterAllowance,
      familyBonusPlusEUR: familyBonus,
      pensionerBonusEUR: pensionerBonus,
      exchangeRate,
    };

    return calculateGrenzgaenger(input);
  }, [grossSalary, exchangeRate, salaryMonths, age, maritalStatus, children, commuterAllowance, familyBonus, pensionerBonus]);

  const formatCurrency = (amount: number, currency: 'CHF' | 'EUR') => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Steuerrechner für Grenzgänger
        </h2>
        <p className="text-slate-600">
          Berechnen Sie Ihr Nettoeinkommen als Grenzgänger zwischen St. Gallen (CH) und Österreich (AT)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h3 className="text-xl font-semibold mb-4">Schweizer Lohndaten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Bruttolohn (CHF) monatlich
              <InfoButton onClick={() => setActiveModal('grossSalary')} />
            </label>
            <input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Wechselkurs (CHF → EUR)
              <InfoButton onClick={() => setActiveModal('exchangeRate')} />
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.0001"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={loadExchangeRate}
                disabled={isLoadingRate}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Aktuellen Wechselkurs von EZB laden"
              >
                <RefreshCw className={`w-5 h-5 ${isLoadingRate ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {rateLastUpdated && (
              <p className="text-xs text-slate-500 mt-1">
                Zuletzt aktualisiert: {rateLastUpdated.toLocaleTimeString('de-CH')}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Alter
              <InfoButton onClick={() => setActiveModal('age')} />
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Monatsgehälter pro Jahr
              <InfoButton onClick={() => setActiveModal('salaryMonths')} />
            </label>
            <select
              value={salaryMonths}
              onChange={(e) => setSalaryMonths(Number(e.target.value) as 12 | 13 | 14)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={12}>12 Monatsgehälter</option>
              <option value={13}>13 Monatsgehälter</option>
              <option value={14}>14 Monatsgehälter</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h3 className="text-xl font-semibold mb-4">Persönliche Daten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Familienstand
              <InfoButton onClick={() => setActiveModal('maritalStatus')} />
            </label>
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value as 'single' | 'married')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="single">Ledig</option>
              <option value="married">Verheiratet</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Anzahl Kinder
              <InfoButton onClick={() => setActiveModal('children')} />
            </label>
            <input
              type="number"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h3 className="text-xl font-semibold mb-4">Österreichische Abzüge & Pauschalen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Pendlerpauschale (EUR) monatlich
              <InfoButton onClick={() => setActiveModal('commuterAllowance')} />
            </label>
            <input
              type="number"
              value={commuterAllowance}
              onChange={(e) => setCommuterAllowance(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Familienbonus Plus (EUR) monatlich
              <InfoButton onClick={() => setActiveModal('familyBonus')} />
            </label>
            <input
              type="number"
              value={familyBonus}
              onChange={(e) => setFamilyBonus(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Pensionistenabsetzbetrag (EUR) monatlich
              <InfoButton onClick={() => setActiveModal('pensionerBonus')} />
            </label>
            <input
              type="number"
              value={pensionerBonus}
              onChange={(e) => setPensionerBonus(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-200">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">Ergebnis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Brutto (EUR)</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(result.grossSalaryEUR, 'EUR')}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Schweizer Abzüge</p>
            <p className="text-2xl font-bold text-red-600">- {formatCurrency(result.breakdown.ahvALV + result.breakdown.bvg + result.breakdown.ktgNBU, 'EUR')}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Quellensteuer SG</p>
            <p className="text-2xl font-bold text-orange-600">- {formatCurrency(result.breakdown.sourceTaxSG, 'EUR')}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Netto (EUR)</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(result.finalNetEUR, 'EUR')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Effektive Steuer- und Abgabenlast</span>
            <span className="text-lg font-bold text-blue-900">{result.effectiveTaxRate.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(result.effectiveTaxRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          PDF-Bericht herunterladen
        </button>
      </div>

      {/* Info Modals */}
      {Object.entries(helpTexts).map(([key, help]) => (
        <InfoModal
          key={key}
          isOpen={activeModal === key}
          onClose={() => setActiveModal(null)}
          title={help.title}
        >
          {help.content}
        </InfoModal>
      ))}
    </div>
  );
}
