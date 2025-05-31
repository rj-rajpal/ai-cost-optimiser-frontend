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
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation">
          <p className="text-text-primary font-medium mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary text-sm">
                {entry.dataKey === 'spend' ? 'Spend:' : 'Tokens:'}
              </span>
              <span className="text-text-primary font-medium text-sm">
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
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="tokensGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-text-tertiary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="spend"
              orientation="left"
              tickFormatter={formatCurrency}
              stroke="var(--color-text-tertiary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="tokens"
              orientation="right"
              tickFormatter={formatTokens}
              stroke="var(--color-text-tertiary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: 'var(--color-text-secondary)' }}
            />
            <Area
              yAxisId="spend"
              type="monotone"
              dataKey="spend"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#spendGradient)"
              name="Spend ($)"
            />
            <Area
              yAxisId="tokens"
              type="monotone"
              dataKey="tokens"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#tokensGradient)"
              name="Tokens"
            />
          </AreaChart>
        ) : (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-text-tertiary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="spend"
              orientation="left"
              tickFormatter={formatCurrency}
              stroke="var(--color-text-tertiary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="tokens"
              orientation="right"
              tickFormatter={formatTokens}
              stroke="var(--color-text-tertiary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: 'var(--color-text-secondary)' }}
            />
            <Bar
              yAxisId="spend"
              dataKey="spend"
              fill="var(--color-primary)"
              name="Spend ($)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="tokens"
              dataKey="tokens"
              fill="var(--color-accent)"
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