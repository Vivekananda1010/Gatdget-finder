
import React from 'react';
import { PhoneRecommendation } from '../types';

interface ComparisonTableProps {
  phones: PhoneRecommendation[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ phones }) => {
  const specs = [
    { label: 'Match Score', key: 'matchScore', format: (v: number) => `${v}%` },
    { label: 'Price', key: 'priceEstimate' },
    { label: 'Processor', key: 'processor' },
    { label: 'Display', key: 'display' },
    { label: 'Camera', key: 'camera' },
    { label: 'Battery', key: 'battery' },
  ];

  return (
    <div className="mt-20 overflow-hidden border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-xl">
      <div className="p-8 border-b border-slate-800">
        <h2 className="text-2xl font-bold">Spec-by-Spec Comparison</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900">
              <th className="p-6 text-xs font-bold text-slate-500 uppercase">Feature</th>
              {phones.map(p => (
                <th key={p.id} className="p-6 text-sm font-bold text-indigo-400">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {specs.map(spec => (
              <tr key={spec.label} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-6 text-xs font-bold text-slate-500 uppercase">{spec.label}</td>
                {phones.map(p => (
                  <td key={p.id} className="p-6 text-sm text-slate-300">
                    {(p as any)[spec.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
