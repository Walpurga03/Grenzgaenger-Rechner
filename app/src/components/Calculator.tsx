import { useState, useMemo, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { calculateGrenzgaenger, type GrenzgaengerInput } from '@/lib/calculator';
import { fetchExchangeRate } from '@/lib/currency';
import { calculateCommuterAllowance } from '@/lib/taxConfig';
import { validateField, validationRules } from '@/lib/validation';
import { InfoButton } from './InfoButton';
import { InfoModal } from './InfoModal';
import { BreakdownChart } from './BreakdownChart';
import { TaxDistributionChart } from './TaxDistributionChart';
import { Notification } from './Notification';
import { Collapsible } from './Collapsible';
import { PDFReport } from './PDFReport';
import { helpTexts } from '@/lib/helpTexts';
import { RefreshCw, Plus, Trash2, Download } from 'lucide-react';
import { type ChildDetails } from '@/types/calculator';

export function Calculator() {
  // State für alle Eingabewerte
  const [grossSalary, setGrossSalary] = useState<number>(6000);
  const [exchangeRate, setExchangeRate] = useState<number>(1.07);
  const [salaryMonths, setSalaryMonths] = useState<12 | 13 | 14>(12);
  const [age, setAge] = useState<number>(30);
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');
  const [childrenDetails, setChildrenDetails] = useState<ChildDetails[]>([]);
  const [commuterDistanceKm, setCommuterDistanceKm] = useState<number>(30);
  const [publicTransportReasonable, setPublicTransportReasonable] = useState<boolean>(true);
  const [commuterAllowance, setCommuterAllowance] = useState<number>(0);
  const [familyBonus, setFamilyBonus] = useState<number>(0);
  const [insuranceContribution, setInsuranceContribution] = useState<number>(0);
  const [soleEarnerBonus, setSoleEarnerBonus] = useState<number>(0);
  const [isSoleEarner, setIsSoleEarner] = useState<boolean>(false);

  // State für Info-Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // State für Wechselkurs-Laden
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(false);
  const [rateLastUpdated, setRateLastUpdated] = useState<Date | null>(null);

  // State für Validierungsfehler
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // State für Notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Wechselkurs beim Start automatisch laden
  useEffect(() => {
    loadExchangeRate();
  }, []);

  // Funktion zum Laden des aktuellen Wechselkurses
  const loadExchangeRate = async () => {
    setIsLoadingRate(true);
    setNotification(null);
    try {
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setRateLastUpdated(new Date());
      setNotification({
        type: 'success',
        message: `Wechselkurs aktualisiert: 1 CHF = ${rate.toFixed(4)} EUR (bzw. 1 EUR = ${(1/rate).toFixed(4)} CHF)`,
      });
      // Auto-hide nach 3 Sekunden
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Fehler beim Laden des Wechselkurses', error);
      setNotification({
        type: 'error',
        message: 'Fehler beim Laden des Wechselkurses. Bitte versuchen Sie es erneut.',
      });
    } finally {
      setIsLoadingRate(false);
    }
  };

  // PDF generieren und herunterladen
  const handleDownloadPDF = async () => {
    try {
      setNotification({
        type: 'info',
        message: 'PDF wird generiert...',
      });

      const pdfDoc = (
        <PDFReport
          result={result}
          inputData={{
            grossSalaryCHF: grossSalary,
            salaryMonths,
            age,
            maritalStatus,
            childrenCount: childrenDetails.length,
            commuterDistanceKm,
            commuterAllowanceEUR: commuterAllowance,
            soleEarnerBonusEUR: soleEarnerBonus,
            insuranceContributionEUR: insuranceContribution,
            exchangeRate,
          }}
        />
      );

      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `Grenzgänger-Berechnung_${new Date().toISOString().split('T')[0]}.pdf`;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      setNotification({
        type: 'success',
        message: 'PDF erfolgreich heruntergeladen!',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Fehler beim Erstellen des PDFs', error);
      setNotification({
        type: 'error',
        message: 'Fehler beim Erstellen des PDFs. Bitte versuchen Sie es erneut.',
      });
    }
  };

  // Kind hinzufügen
  const addChild = () => {
    setChildrenDetails([
      ...childrenDetails,
      { isOver18: false, livesAtHome: true, isStudent: false }
    ]);
  };

  // Kind entfernen
  const removeChild = (index: number) => {
    setChildrenDetails(childrenDetails.filter((_, i) => i !== index));
  };

  // Kind-Details aktualisieren
  const updateChild = (index: number, updates: Partial<ChildDetails>) => {
    const newChildren = [...childrenDetails];
    newChildren[index] = { ...newChildren[index], ...updates };
    setChildrenDetails(newChildren);
  };

  // Pendlerpauschale automatisch berechnen
  useEffect(() => {
    const amount = calculateCommuterAllowance(commuterDistanceKm, publicTransportReasonable);
    setCommuterAllowance(amount);
  }, [commuterDistanceKm, publicTransportReasonable]);

  // Familienbonus automatisch berechnen
  useEffect(() => {
    const calculateFamilyBonus = () => {
      let total = 0;
      childrenDetails.forEach(child => {
        if (!child.isOver18) {
          total += 166.68; // Unter 18 Jahren
        } else if (child.isOver18 && child.livesAtHome && child.isStudent) {
          total += 54.18; // Über 18, zuhause wohnend, in Ausbildung
        }
      });
      setFamilyBonus(Math.round(total * 100) / 100);
    };
    
    calculateFamilyBonus();
  }, [childrenDetails]);

  // Alleinverdienerabsetzbetrag automatisch berechnen
  useEffect(() => {
    if (isSoleEarner && childrenDetails.length > 0) {
      const baseAmount = 572; // Mit 1 Kind
      const additionalChildren = Math.max(0, childrenDetails.length - 1);
      const totalYearly = baseAmount + (additionalChildren * 206);
      setSoleEarnerBonus(totalYearly);
    } else {
      setSoleEarnerBonus(0);
    }
  }, [isSoleEarner, childrenDetails]);

  // Validierungsfunktion für einzelne Felder
  const validateAndSetField = (fieldName: string, value: number, setter: (value: number) => void) => {
    const rule = validationRules[fieldName];
    if (rule) {
      const error = validateField(value, rule);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [fieldName]: error.message }));
      } else {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
    setter(value);
  };

  // Memoized Berechnung - nur neu berechnen wenn sich Inputs ändern
  const result = useMemo(() => {
    const input: GrenzgaengerInput = {
      grossSalaryCHF: grossSalary,
      salaryMonthsPerYear: salaryMonths,
      age,
      maritalStatus,
      childrenDetails,
      commuterDistanceKm,
      commuterAllowanceEUR: commuterAllowance,
      familyBonusPlusEUR: familyBonus,
      soleEarnerBonusEUR: soleEarnerBonus,
      pensionerBonusEUR: 0, // Nicht mehr verwendet
      insuranceContributionEUR: insuranceContribution,
      exchangeRate,
    };

    return calculateGrenzgaenger(input);
  }, [grossSalary, exchangeRate, salaryMonths, age, maritalStatus, childrenDetails, commuterDistanceKm, commuterAllowance, familyBonus, soleEarnerBonus, insuranceContribution]);

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

      {/* Notification Banner */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-slate-200">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Schweizer Lohndaten</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Bruttolohn (CHF) monatlich
              <InfoButton onClick={() => setActiveModal('grossSalary')} />
            </label>
            <input
              type="number"
              value={grossSalary}
              onChange={(e) => validateAndSetField('grossSalary', Number(e.target.value), setGrossSalary)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.grossSalary ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {validationErrors.grossSalary && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.grossSalary}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Wechselkurs: 1 CHF = ? EUR
              <InfoButton onClick={() => setActiveModal('exchangeRate')} />
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.0001"
                value={exchangeRate}
                onChange={(e) => validateAndSetField('exchangeRate', Number(e.target.value), setExchangeRate)}
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.exchangeRate ? 'border-red-500' : 'border-slate-300'
                }`}
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
            {validationErrors.exchangeRate && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.exchangeRate}</p>
            )}
            {!validationErrors.exchangeRate && (
              <p className="text-xs text-green-600 mt-1">
                💡 Stand 2026: CHF 100 = EUR {(100 * exchangeRate).toFixed(2)} | 
                (CHF ist aktuell stärker als EUR!)
              </p>
            )}
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
              onChange={(e) => validateAndSetField('age', Number(e.target.value), setAge)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.age ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {validationErrors.age && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.age}</p>
            )}
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

        {/* Jahresbrutto Anzeige */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-600 mb-1">Jahresbrutto (CHF)</p>
              <p className="text-lg font-bold text-blue-900">
                {formatCurrency(grossSalary * salaryMonths, 'CHF')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {grossSalary.toLocaleString('de-CH')} × {salaryMonths} Monate
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Jahresbrutto (EUR)</p>
              <p className="text-lg font-bold text-blue-900">
                {formatCurrency(grossSalary * salaryMonths * exchangeRate, 'EUR')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Umgerechnet mit {exchangeRate.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Ø Monatsbrutto (EUR)</p>
              <p className="text-lg font-bold text-blue-900">
                {formatCurrency((grossSalary * salaryMonths * exchangeRate) / 12, 'EUR')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Jahresbrutto ÷ 12 Monate
              </p>
            </div>
          </div>
        </div>
      </div>

      <Collapsible 
        title="Persönliche Daten" 
        defaultOpen={true}
        badge={childrenDetails.length > 0 ? `${childrenDetails.length} Kind${childrenDetails.length > 1 ? 'er' : ''}` : undefined}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        </div>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              Kinder
              <InfoButton onClick={() => setActiveModal('children')} />
            </label>
            <button
              onClick={addChild}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Kind hinzufügen
            </button>
          </div>

          {childrenDetails.length === 0 && (
            <p className="text-sm text-slate-500 italic">Keine Kinder hinzugefügt. Klicken Sie auf "Kind hinzufügen".</p>
          )}

          <div className="space-y-3">
            {childrenDetails.map((child, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">Kind {index + 1}</span>
                  <button
                    onClick={() => removeChild(index)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Kind entfernen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`child-${index}-over18`}
                      checked={child.isOver18}
                      onChange={(e) => updateChild(index, { isOver18: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor={`child-${index}-over18`} className="text-sm text-slate-700">
                      Über 18 Jahre
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`child-${index}-home`}
                      checked={child.livesAtHome}
                      onChange={(e) => updateChild(index, { livesAtHome: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor={`child-${index}-home`} className="text-sm text-slate-700">
                      Wohnt zuhause
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`child-${index}-student`}
                      checked={child.isStudent}
                      onChange={(e) => updateChild(index, { isStudent: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor={`child-${index}-student`} className="text-sm text-slate-700">
                      In Ausbildung/Student
                    </label>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-600">
                  Familienbonus: <span className="font-semibold">
                    {!child.isOver18 
                      ? '€166.68/Monat' 
                      : (child.isOver18 && child.livesAtHome && child.isStudent)
                        ? '€54.18/Monat'
                        : '€0/Monat (nicht berechtigt)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Collapsible>

      <Collapsible 
        title="Österreichische Abzüge & Pauschalen" 
        defaultOpen={true}
        badge={commuterAllowance > 0 ? `€${commuterAllowance.toFixed(0)}/M` : undefined}
      >
        {/* Pendlerpauschale Sektion */}
        <div className="mb-6 pb-6 border-b border-slate-200">
          <label className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-3">
            Pendlerpauschale
            <InfoButton onClick={() => setActiveModal('commuterAllowance')} />
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Entfernung (einfach, in km)
              </label>
              <input
                type="number"
                value={commuterDistanceKm}
                onChange={(e) => validateAndSetField('commuterDistanceKm', Number(e.target.value), setCommuterDistanceKm)}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.commuterDistanceKm ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="z.B. 30"
              />
              {validationErrors.commuterDistanceKm && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.commuterDistanceKm}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Öffentliche Verkehrsmittel
              </label>
              <div className="flex items-center gap-6 h-[42px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publicTransport"
                    checked={publicTransportReasonable}
                    onChange={() => setPublicTransportReasonable(true)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Zumutbar (Kleines Pauschale)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publicTransport"
                    checked={!publicTransportReasonable}
                    onChange={() => setPublicTransportReasonable(false)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Unzumutbar (Großes Pauschale)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Berechnete Pendlerpauschale:</span>
              <span className="text-lg font-bold text-blue-900">
                {commuterAllowance > 0 ? `€${commuterAllowance.toFixed(2)}/Monat` : '€0/Monat'}
              </span>
            </div>
            {commuterDistanceKm < 2 && (
              <p className="text-xs text-blue-700 mt-1">
                💡 Pendlerpauschale wird erst ab 2 km Entfernung gewährt
              </p>
            )}
            {commuterDistanceKm >= 2 && commuterDistanceKm < 20 && publicTransportReasonable && (
              <p className="text-xs text-blue-700 mt-1">
                💡 Kleines Pauschale wird erst ab 20 km gewährt
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              Familienbonus Plus (EUR) monatlich
              <InfoButton onClick={() => setActiveModal('familyBonus')} />
            </label>
            <input
              type="number"
              value={familyBonus}
              onChange={(e) => setFamilyBonus(Number(e.target.value))}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
              title="Wird automatisch basierend auf Kindern berechnet"
            />
            <p className="text-xs text-slate-500 mt-1">Automatisch berechnet</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
              <input
                type="checkbox"
                checked={isSoleEarner}
                onChange={(e) => setIsSoleEarner(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              Alleinverdiener/in mit Kind(ern)
              <InfoButton onClick={() => setActiveModal('soleEarnerBonus')} />
            </label>
            {isSoleEarner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Alleinverdienerabsetzbetrag:</span><br />
                  {soleEarnerBonus > 0 
                    ? `EUR ${soleEarnerBonus.toFixed(2)}/Jahr (EUR ${(soleEarnerBonus / 12).toFixed(2)}/Monat)`
                    : 'Mindestens 1 Kind erforderlich'
                  }
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Nur wenn Partner/in weniger als EUR 6.937/Jahr verdient
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            Versicherungsbeitrag (EUR) monatlich
            <InfoButton onClick={() => setActiveModal('insuranceContribution')} />
          </label>
          <input
            type="number"
            value={insuranceContribution}
            onChange={(e) => validateAndSetField('insuranceContribution', Number(e.target.value), setInsuranceContribution)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.insuranceContribution ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="z.B. 150"
          />
          {validationErrors.insuranceContribution ? (
            <p className="text-xs text-red-600 mt-1">{validationErrors.insuranceContribution}</p>
          ) : (
            <p className="text-xs text-slate-500 mt-1">z.B. Krankenversicherung, Lebensversicherung</p>
          )}
        </div>
      </Collapsible>

      <Collapsible title="Berechnungsergebnis" defaultOpen={true} badge="✓">
        {/* Transparenz-Hinweis zur Bruttolohn-Berechnung */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            📊 Bruttolohn-Berechnung ({salaryMonths} Gehälter/Jahr):
          </p>
          <div className="text-xs text-blue-800 space-y-1">
            <p>
              <strong>Monatlicher Bruttolohn:</strong> CHF {formatCurrency(grossSalary, 'CHF').replace('CHF ', '')} 
              = <strong>EUR {formatCurrency(grossSalary * exchangeRate, 'EUR').replace('EUR ', '')}</strong>
            </p>
            {salaryMonths > 12 && (
              <>
                <p className="text-xs italic text-blue-700 mt-2">
                  💡 Bei {salaryMonths} Gehältern: Die Schweizer Sozialversicherungen werden auf den Durchschnittslohn 
                  (CHF {formatCurrency((grossSalary * salaryMonths) / 12, 'CHF').replace('CHF ', '')}) berechnet. 
                  {salaryMonths === 13 && ' Das 13. Gehalt wird in AT mit 6% besteuert (begünstigt).'}
                  {salaryMonths === 14 && ' Das 13. und 14. Gehalt werden in AT mit je 6% besteuert (begünstigt).'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 md:p-4 border border-slate-200">
            <p className="text-xs md:text-sm text-slate-600 mb-1">Brutto (EUR)</p>
            <p className="text-xl md:text-2xl font-bold text-slate-900">{formatCurrency(result.grossSalaryEUR, 'EUR')}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 md:p-4 border border-red-200">
            <p className="text-xs md:text-sm text-slate-600 mb-1">CH-Abzüge</p>
            <p className="text-lg md:text-2xl font-bold text-red-600 break-words">- {formatCurrency(result.breakdown.ahvALV + result.breakdown.bvg + result.breakdown.ktgNBU, 'EUR')}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 md:p-4 border border-orange-200">
            <p className="text-xs md:text-sm text-slate-600 mb-1">SG-Steuer</p>
            <p className="text-lg md:text-2xl font-bold text-orange-600 break-words">- {formatCurrency(result.breakdown.sourceTaxSG, 'EUR')}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 md:p-4 border border-purple-200">
            <p className="text-xs md:text-sm text-slate-600 mb-1">AT-Steuer</p>
            <p className="text-lg md:text-2xl font-bold text-purple-600 break-words">- {formatCurrency(result.breakdown.austrianTax, 'EUR')}</p>
            <p className="text-[10px] md:text-xs text-slate-500 mt-1">
              Nach Anrechnung
              <span className="hidden sm:inline mx-2">•</span>
              <span className="block sm:inline">Jährl.: {formatCurrency(result.breakdown.austrianTax * 12, 'EUR')}</span>
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200">
            <p className="text-xs md:text-sm text-slate-600 mb-1">Ø Netto/Monat</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{formatCurrency(result.averageMonthlyNetEUR, 'EUR')}</p>
            <p className="text-[10px] md:text-xs text-slate-500 mt-1">
              {formatCurrency(result.yearlyNetEUR, 'EUR')}/Jahr
              <span className="hidden sm:inline mx-2">•</span>
              <span className="block sm:inline">{salaryMonths}× Gehalt</span>
            </p>
          </div>
        </div>

        {/* Erklärung 14 Gehälter */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm font-semibold text-green-900 mb-1">
            💰 Warum 14 Gehälter?
          </p>
          <p className="text-xs text-green-800">
            In Österreich ist der Standard <strong>14 Gehälter</strong> (12 Monatsgehälter + Urlaubsgeld + Weihnachtsgeld).
            Für bessere Vergleichbarkeit wird das Jahresnetto ({formatCurrency(result.finalNetEUR * 12, 'EUR')}) 
            auf 12 Monate verteilt = <strong>{formatCurrency(result.averageMonthlyNetEUR, 'EUR')}/Monat</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">🇦🇹 Österreichische Vorteile</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Pendlerpauschale:</span>
                <span className="font-semibold text-blue-600 text-right">Steuerlich berücksichtigt</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Familienbonus Plus:</span>
                <span className="font-semibold text-green-600">+ {formatCurrency(result.breakdown.familyBonus, 'EUR')}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-1 mt-1">
                <span className="text-slate-600">Versicherungsbeitrag:</span>
                <span className="font-semibold text-red-600">- {formatCurrency(result.breakdown.insuranceContribution, 'EUR')}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Versicherung steuerlich absetzbar</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-700">Effektive Steuer- und Abgabenlast</span>
              <span className="text-xl sm:text-lg font-bold text-blue-900">{result.effectiveTaxRate.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(result.effectiveTaxRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Visualisierungen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreakdownChart result={result} />
          <TaxDistributionChart result={result} />
        </div>
      </Collapsible>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button 
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
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
