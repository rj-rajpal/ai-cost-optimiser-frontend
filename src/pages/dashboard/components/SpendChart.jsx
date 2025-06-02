import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SpendChart = ({ data, type, timeRange }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTokens = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 1000000) + 'M';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-sky-gray rounded-lg p-3 shadow-lg">
          <p className="text-soft-navy font-medium mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-gray text-sm">
                {entry.dataKey === 'spend' ? 'Spend:' : 'Tokens:'}
              </span>
              <span className="text-soft-navy font-medium text-sm">
                {entry.dataKey === 'spend' 
                  ? formatCurrency(entry.value)
                  : formatTokens(entry.value)
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="tokensGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              yAxisId="spend"
              orientation="left"
              tickFormatter={formatCurrency}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              yAxisId="tokens"
              orientation="right"
              tickFormatter={formatTokens}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#475569' }}
            />
            <Area
              yAxisId="spend"
              type="monotone"
              dataKey="spend"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#spendGradient)"
              name="Spend ($)"
            />
            <Area
              yAxisId="tokens"
              type="monotone"
              dataKey="tokens"
              stroke="#14b8a6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#tokensGradient)"
              name="Tokens"
            />
          </AreaChart>
        ) : (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              yAxisId="spend"
              orientation="left"
              tickFormatter={formatCurrency}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              yAxisId="tokens"
              orientation="right"
              tickFormatter={formatTokens}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#475569' }}
            />
            <Bar
              yAxisId="spend"
              dataKey="spend"
              fill="#6366f1"
              name="Spend ($)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="tokens"
              dataKey="tokens"
              fill="#14b8a6"
              name="Tokens"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SpendChart;