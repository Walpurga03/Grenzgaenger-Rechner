import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { type GrenzgaengerResult } from '@/lib/calculator';

interface BreakdownChartProps {
  result: GrenzgaengerResult;
}

export function BreakdownChart({ result }: BreakdownChartProps) {
  const data = [
    {
      name: 'Brutto CHF',
      value: result.grossSalaryCHF,
      color: '#3b82f6', // blue
    },
    {
      name: 'CH-Abzüge',
      value: -(result.breakdown.ahvALV + result.breakdown.bvg + result.breakdown.ktgNBU),
      color: '#ef4444', // red
    },
    {
      name: 'SG-Steuer',
      value: -result.breakdown.sourceTaxSG,
      color: '#f97316', // orange
    },
    {
      name: 'AT-Steuer',
      value: -result.breakdown.austrianTax,
      color: '#a855f7', // purple
    },
    {
      name: 'Familienbonus',
      value: result.breakdown.familyBonus,
      color: '#22c55e', // green
    },
    {
      name: 'Versicherung',
      value: -result.breakdown.insuranceContribution,
      color: '#dc2626', // red-dark
    },
    {
      name: 'Netto (Ø 14)',
      value: result.finalNetEURAustrianComparison,
      color: '#16a34a', // green-dark
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        📊 Breakdown: Brutto → Netto (Ø 14 Gehälter)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value > 0 ? '+' : ''}${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip 
            formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : '0'}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '0.75rem'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '1rem' }}
            iconType="circle"
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Brutto (CHF):</p>
            <p className="font-semibold text-blue-600">{formatCurrency(result.grossSalaryCHF)}</p>
          </div>
          <div>
            <p className="text-slate-600">Netto (Ø 14 Geh.):</p>
            <p className="font-semibold text-green-600">{formatCurrency(result.finalNetEURAustrianComparison)}</p>
          </div>
          <div>
            <p className="text-slate-600">Gesamt-Abzüge:</p>
            <p className="font-semibold text-red-600">
              -{formatCurrency(
                result.breakdown.ahvALV + 
                result.breakdown.bvg + 
                result.breakdown.ktgNBU + 
                result.breakdown.sourceTaxSG + 
                result.breakdown.austrianTax +
                result.breakdown.insuranceContribution -
                result.breakdown.familyBonus
              )}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Effektive Belastung:</p>
            <p className="font-semibold text-slate-800">
              {((result.totalTaxBurden / result.grossSalaryCHF) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
