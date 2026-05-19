import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Clock, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  clearHistory: () => void;
}

export default function HistoryPanel({ isOpen, onClose, history, clearHistory }: HistoryPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-40 flex flex-col border-l border-[#141414]/10"
          >
            <div className="p-6 border-b border-[#141414]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#FF6321]" />
                <h3 className="font-bold text-lg">Riwayat Perhitungan</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#141414]/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#141414]/40 text-sm space-y-2">
                  <Clock size={48} strokeWidth={1} />
                  <p>Belum ada riwayat</p>
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 bg-[#F5F5F0] rounded-xl border border-[#141414]/5 group relative transition-all hover:border-[#FF6321]/30 hover:shadow-sm"
                  >
                    <div className="text-[10px] opacity-40 font-mono mb-1">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm font-mono opacity-60 break-all leading-tight">
                      {item.expression}
                    </div>
                    <div className="text-xl font-bold text-[#141414] mt-1 break-all">
                      = {item.result}
                    </div>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <div className="p-6 border-t border-[#141414]/10">
                <button 
                  onClick={clearHistory}
                  className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                >
                  <Trash2 size={18} />
                  Bersihkan Semua
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
