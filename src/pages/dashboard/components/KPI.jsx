import React from 'react';

export const KPI = ({ icon, label, value, sub }) => (
  <div className="rounded-xl shadow-mist p-6 flex gap-4 items-center bg-white border border-sky-gray hover:shadow-lg transition-shadow duration-200">
    <div className="text-3xl">{icon}</div>
    <div>
      <div className="text-2xl font-semibold text-soft-navy">{value}</div>
      <div className="text-sm text-slate-gray font-medium">{label}</div>
      {sub && <div className="text-xs text-muted-indigo mt-1 font-medium">{sub}</div>}
    </div>
  </div>
);

export default KPI; 