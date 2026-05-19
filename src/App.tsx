/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Calculator, 
  FlaskConical, 
  TrendingUp, 
  LineChart, 
  ArrowLeftRight, 
  History as HistoryIcon,
  X,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Page components (will be created next)
import StandardCalc from './components/StandardCalc';
import ScientificCalc from './components/ScientificCalc';
import FinancialCalc from './components/FinancialCalc';
import GraphingCalc from './components/GraphingCalc';
import UnitConverter from './components/UnitConverter';
import HistoryPanel from './components/HistoryPanel';

type CalculatorMode = 'standar' | 'ilmiah' | 'keuangan' | 'grafik' | 'konverter';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export default function App() {
  const [mode, setMode] = useState<CalculatorMode>('standar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const addToHistory = (expression: string, result: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const clearHistory = () => setHistory([]);

  const menuItems = [
    { id: 'standar', name: 'Standar', icon: Calculator, description: 'Dasar matematika' },
    { id: 'ilmiah', name: 'Ilmiah', icon: FlaskConical, description: 'Sains & Teknik' },
    { id: 'keuangan', name: 'Keuangan', icon: TrendingUp, description: 'Investasi & Bunga' },
    { id: 'grafik', name: 'Grafik', icon: LineChart, description: 'Plot Persamaan' },
    { id: 'konverter', name: 'Konverter', icon: ArrowLeftRight, description: 'Unit & Satuan' },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F0] text-[#141414] font-sans overflow-hidden">
      {/* Sidebar for navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-[#141414]/10 flex flex-col z-20"
      >
        <div className="p-4 flex items-center justify-between border-bottom border-[#141414]/5">
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Kalkulator<span className="text-[#FF6321]">Super</span></span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#141414]/5 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id as CalculatorMode)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-[#141414] text-white shadow-lg" 
                    : "hover:bg-[#141414]/5"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isActive ? "bg-white/10" : "bg-[#141414]/5"
                )}>
                  <Icon size={20} />
                </div>
                {isSidebarOpen && (
                  <div className="flex flex-col items-start overflow-hidden whitespace-nowrap">
                    <span className="font-semibold text-sm">{item.name}</span>
                    <span className={cn(
                      "text-[10px] opacity-60",
                      isActive ? "text-white/70" : "text-[#141414]/60"
                    )}>{item.description}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#141414]/5">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="w-full flex items-center justify-between p-3 hover:bg-[#141414]/5 rounded-xl text-sm"
          >
            <div className="flex items-center gap-3">
              <HistoryIcon size={18} />
              {isSidebarOpen && <span className="font-medium">Riwayat</span>}
            </div>
            {isSidebarOpen && <ChevronRight size={14} className="opacity-40" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col bg-[#E4E3E0]">
        <header className="p-4 bg-white/50 backdrop-blur-sm border-b border-[#141414]/5 flex items-center justify-between">
          <h2 className="font-bold text-lg capitalize">{mode}</h2>
          <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
            v1.0 • PRECISION_AUTO
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-4xl mx-auto"
            >
              {mode === 'standar' && <StandardCalc addToHistory={addToHistory} />}
              {mode === 'ilmiah' && <ScientificCalc addToHistory={addToHistory} />}
              {mode === 'keuangan' && <FinancialCalc />}
              {mode === 'grafik' && <GraphingCalc />}
              {mode === 'konverter' && <UnitConverter />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* History Panel Overlay */}
      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        clearHistory={clearHistory}
      />
    </div>
  );
}
