import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SpendVsTokensChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#667EEA" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#667EEA" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A7DADC" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#A7DADC" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <YAxis 
          yAxisId="left" 
          tickFormatter={v => `$${v/1_000}k`}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          tickFormatter={v => `${v/1_000_000}M`}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <Tooltip 
          formatter={(v, name) => [
            name === 'spend' ? `$${v.toLocaleString()}` : `${v.toLocaleString()} tokens`,
            name === 'spend' ? 'Spend' : 'Tokens'
          ]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #CBD2D9',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(62, 76, 89, 0.08)',
            fontSize: '14px'
          }}
          labelStyle={{ color: '#3E4C59', fontWeight: '500' }}
        />
        <Area 
          yAxisId="left" 
          type="monotone" 
          dataKey="spend" 
          stroke="#667EEA"
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#spend)" 
        />
        <Area 
          yAxisId="right" 
          type="monotone" 
          dataKey="tokens" 
          stroke="#A7DADC"
          strokeDasharray="3 3" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#tokens)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 