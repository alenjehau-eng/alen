import { useState, useEffect } from 'react';
import { ArrowLeftRight, Ruler, Scale, Thermometer, CloudRain } from 'lucide-react';
import { cn } from '../lib/utils';

type UnitType = 'length' | 'weight' | 'temp' | 'volume';

interface ConversionRule {
  [key: string]: number;
}

const CONVERSIONS: Record<UnitType, ConversionRule> = {
  length: {
    'm': 1,
    'km': 1000,
    'cm': 0.01,
    'mm': 0.001,
    'in': 0.0254,
    'ft': 0.3048,
    'mi': 1609.34
  },
  weight: {
    'kg': 1,
    'g': 0.001,
    'mg': 0.000001,
    'lb': 0.453592,
    'oz': 0.0283495
  },
  volume: {
    'l': 1,
    'ml': 0.001,
    'gal': 3.78541,
    'cup': 0.236588
  },
  temp: {
    // Special handling needed for temp
    'c': 1,
    'f': 1,
    'k': 1
  }
};

export default function UnitConverter() {
  const [type, setType] = useState<UnitType>('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('1');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const units = Object.keys(CONVERSIONS[type]);
    setFromUnit(units[0]);
    setToUnit(units[1]);
  }, [type]);

  useEffect(() => {
    convert();
  }, [value, fromUnit, toUnit, type]);

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    if (type === 'temp') {
      let celsius = val;
      if (fromUnit === 'f') celsius = (val - 32) * 5/9;
      if (fromUnit === 'k') celsius = val - 273.15;

      let final = celsius;
      if (toUnit === 'f') final = (celsius * 9/5) + 32;
      if (toUnit === 'k') final = celsius + 273.15;
      
      setResult(final.toFixed(4));
    } else {
      const fromBase = val * CONVERSIONS[type][fromUnit];
      const final = fromBase / CONVERSIONS[type][toUnit];
      setResult(final.toFixed(4));
    }
  };

  const types = [
    { id: 'length', label: 'Panjang', icon: Ruler },
    { id: 'weight', label: 'Berat', icon: Scale },
    { id: 'temp', label: 'Suhu', icon: Thermometer },
    { id: 'volume', label: 'Volume', icon: CloudRain },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex bg-white rounded-2xl p-2 border border-[#141414]/10 shadow-sm overflow-x-auto no-scrollbar">
        {types.map((t) => {
          const Icon = t.icon;
          const isActive = type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setType(t.id as UnitType)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                isActive ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]/60"
              )}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[#141414]/10 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 px-2">Dari</label>
              <select 
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full p-4 bg-[#F5F5F0] rounded-2xl border-none font-bold outline-none ring-1 ring-[#141414]/5 focus:ring-[#FF6321]"
              >
                {Object.keys(CONVERSIONS[type]).map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
              </select>
            </div>
            <input 
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-6 text-3xl font-mono font-bold bg-[#F5F5F0] rounded-2xl border-none outline-none ring-1 ring-[#141414]/5 focus:ring-[#FF6321]"
              placeholder="0"
            />
          </div>

          <div className="p-4 rounded-full bg-[#FF6321]/10 text-[#FF6321]">
            <ArrowLeftRight size={24} />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 px-2">Ke</label>
              <select 
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full p-4 bg-[#F5F5F0] rounded-2xl border-none font-bold outline-none ring-1 ring-[#141414]/5 focus:ring-[#FF6321]"
              >
                {Object.keys(CONVERSIONS[type]).map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="w-full p-6 text-3xl font-mono font-bold bg-[#141414] text-[#FF6321] rounded-2xl border-none">
              {result || '0'}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-[#141414]/40 uppercase tracking-[0.2em] font-bold">
        Konversi Satuan Akurat • Update Otomatis
      </p>
    </div>
  );
}
