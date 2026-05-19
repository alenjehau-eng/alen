import { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FinancialCalc() {
  const [pv, setPv] = useState('');
  const [rate, setRate] = useState('');
  const [nper, setNper] = useState('');
  const [fv, setFv] = useState('');
  const [result, setResult] = useState<{fv: number; interest: number} | null>(null);

  const calculateFV = () => {
    const P = parseFloat(pv);
    const r = parseFloat(rate) / 100 / 12; // Monthly
    const n = parseFloat(nper) * 12; // Monthly
    
    if (isNaN(P) || isNaN(r) || isNaN(n)) return;

    // Standard FV formula for lump sum
    const futureValue = P * Math.pow(1 + r, n);
    setResult({
      fv: futureValue,
      interest: futureValue - P
    });
  };

  const reset = () => {
    setPv('');
    setRate('');
    setNper('');
    setResult(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border border-[#141414]/10 shadow-xl space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Kalkulator Investasi</h3>
          <p className="text-sm text-[#141414]/60">Hitung nilai masa depan dari investasi awal.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#141414]/40">Investasi Awal (PV)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#141414]/40" size={18} />
              <input 
                type="number"
                value={pv}
                onChange={(e) => setPv(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#FF6321] transition-all font-mono"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#141414]/40">Suku Bunga Tahunan (%)</label>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-[#141414]/40" size={18} />
              <input 
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#FF6321] transition-all font-mono"
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#141414]/40">Jangka Waktu (Tahun)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#141414]/40" size={18} />
              <input 
                type="number"
                value={nper}
                onChange={(e) => setNper(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#FF6321] transition-all font-mono"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            onClick={calculateFV}
            className="flex-1 bg-[#141414] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#252525] transition-all active:scale-95"
          >
            <Calculator size={18} />
            Hitung FV
          </button>
          <button 
            onClick={reset}
            className="p-4 bg-[#141414]/5 text-[#141414] rounded-2xl hover:bg-[#141414]/10 transition-all"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className={cn(
        "bg-[#141414] rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center transition-all",
        !result && "opacity-20"
      )}>
        {!result ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
              <TrendingUp size={32} />
            </div>
            <p className="text-white/40">Hasil perhitungan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-8 w-full">
            <div>
              <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] mb-2">Nilai Masa Depan</p>
              <h4 className="text-5xl font-mono font-bold text-[#FF6321]">
                ${result.fv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Total Bunga</p>
                <p className="text-lg font-mono font-bold text-green-400">
                  +${result.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Pertumbuhan</p>
                <p className="text-lg font-mono font-bold">
                  {((result.fv / parseFloat(pv) - 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <p className="text-[10px] text-white/20 italic">
              *Perhitungan ini diasumsikan bunga majemuk bulanan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
