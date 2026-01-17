import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { type GrenzgaengerResult } from '@/lib/calculator';

interface TaxDistributionChartProps {
  result: GrenzgaengerResult;
}

export function TaxDistributionChart({ result }: TaxDistributionChartProps) {
  const data = [
    {
      name: 'AHV/ALV',
      value: result.breakdown.ahvALV,
      color: '#3b82f6',
    },
    {
      name: 'BVG',
      value: result.breakdown.bvg,
      color: '#8b5cf6',
    },
    {
      name: 'KTG/NBU',
      value: result.breakdown.ktgNBU,
      color: '#ec4899',
    },
    {
      name: 'SG-Quellensteuer',
      value: result.breakdown.sourceTaxSG,
      color: '#f97316',
    },
    {
      name: 'AT-Steuer (theor.)',
      value: result.breakdown.austrianTax,
      color: '#a855f7',
    },
    {
      name: 'Versicherung',
      value: result.breakdown.insuranceContribution,
      color: '#dc2626',
    },
  ].filter(item => item.value > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalDeductions = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / totalDeductions) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">
        🥧 Verteilung der Abzüge
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number | undefined, name: string | undefined) => [
              value !== undefined ? formatCurrency(value) : '0',
              name || ''
            ]}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem'
            }}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '0.75rem' }}
            formatter={(value, entry: any) => {
              const shortName = value.length > 15 ? `${value.substring(0, 15)}...` : value;
              return `${shortName}: ${formatCurrency(entry.payload.value)}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center text-xs sm:text-base">
          <p className="text-slate-600">Gesamt-Abzüge:</p>
          <p className="text-lg sm:text-xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p>
        </div>
      </div>
    </div>
  );
}
