import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { evaluate } from 'mathjs';
import { Play, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export default function GraphingCalc() {
  const [expression, setExpression] = useState('x^2');
  const [error, setError] = useState<string | null>(null);

  const data = useMemo(() => {
    const points = [];
    setError(null);
    try {
      for (let x = -10; x <= 10; x += 0.5) {
        // Use mathjs to evaluate the expression with scope {x}
        const y = evaluate(expression, { x });
        if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
          points.push({ x: x.toFixed(1), y: parseFloat(y.toFixed(4)) });
        }
      }
    } catch (e) {
      setError('Persamaan tidak valid');
      return [];
    }
    return points;
  }, [expression]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-[#141414]/10 shadow-xl space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-1">Kalkulator Grafik</h3>
          <p className="text-xs text-[#141414]/60 uppercase tracking-widest font-bold">Domain: x [-10, 10]</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-[#FF6321]">f(x) = </span>
            <input 
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full pl-16 pr-4 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#FF6321] transition-all font-mono font-bold text-lg"
              placeholder="x^2 + 2x + 1"
            />
          </div>
          <button className="p-4 bg-[#141414] text-white rounded-2xl flex items-center gap-2 hover:bg-[#FF6321] transition-all">
            <Play size={20} fill="currentColor" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2">
            <Info size={14} />
            {error}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[400px] bg-[#141414] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {!error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
              <XAxis 
                dataKey="x" 
                stroke="#ffffff40" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #ffffff20', borderRadius: '12px' }}
                itemStyle={{ color: '#FF6321', fontFamily: 'monospace' }}
              />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#FF6321" 
                strokeWidth={3} 
                dot={false}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
