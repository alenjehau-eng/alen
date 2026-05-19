import { useState } from 'react';
import { evaluate } from 'mathjs';
import { Delete, RotateCcw, Equal, Percent, Divide, X, Minus, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface StandardCalcProps {
  addToHistory: (expression: string, result: string) => void;
}

export default function StandardCalc({ addToHistory }: StandardCalcProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isResult, setIsResult] = useState(false);

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setIsResult(false);
  };

  const handleDelete = () => {
    if (isResult) {
      handleClear();
      return;
    }
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleNumber = (n: string) => {
    if (isResult) {
      setDisplay(n);
      setIsResult(false);
      return;
    }
    if (display === '0') {
      setDisplay(n);
    } else {
      setDisplay(display + n);
    }
  };

  const handleOperator = (op: string) => {
    setIsResult(false);
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      const fullExpression = expression + display;
      // Replace symbols for mathjs
      const mathExpr = fullExpression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
      const result = evaluate(mathExpr);
      const resultString = result.toString();
      
      addToHistory(fullExpression, resultString);
      setDisplay(resultString);
      setExpression('');
      setIsResult(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const buttons = [
    { label: 'C', onClick: handleClear, type: 'action', icon: RotateCcw },
    { label: 'DEL', onClick: handleDelete, type: 'action', icon: Delete },
    { label: '%', onClick: () => handleOperator('%'), type: 'operator', icon: Percent },
    { label: '÷', onClick: () => handleOperator('÷'), type: 'operator', icon: Divide },
    
    { label: '7', onClick: () => handleNumber('7'), type: 'number' },
    { label: '8', onClick: () => handleNumber('8'), type: 'number' },
    { label: '9', onClick: () => handleNumber('9'), type: 'number' },
    { label: '×', onClick: () => handleOperator('×'), type: 'operator', icon: X },
    
    { label: '4', onClick: () => handleNumber('4'), type: 'number' },
    { label: '5', onClick: () => handleNumber('5'), type: 'number' },
    { label: '6', onClick: () => handleNumber('6'), type: 'number' },
    { label: '-', onClick: () => handleOperator('-'), type: 'operator', icon: Minus },
    
    { label: '1', onClick: () => handleNumber('1'), type: 'number' },
    { label: '2', onClick: () => handleNumber('2'), type: 'number' },
    { label: '3', onClick: () => handleNumber('3'), type: 'number' },
    { label: '+', onClick: () => handleOperator('+'), type: 'operator', icon: Plus },
    
    { label: '0', onClick: () => handleNumber('0'), type: 'number', className: 'col-span-2' },
    { label: '.', onClick: () => handleNumber('.'), type: 'number' },
    { label: '=', onClick: handleEqual, type: 'equals', icon: Equal },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#141414]/10 max-w-sm mx-auto">
      {/* Display Screen */}
      <div className="bg-[#141414] p-8 flex flex-col items-end justify-end min-h-[160px] text-white">
        <div className="text-sm font-mono opacity-50 mb-2 truncate max-w-full">
          {expression}
        </div>
        <div className={cn(
          "font-mono font-bold leading-none break-all text-right",
          display.length > 10 ? "text-3xl" : "text-5xl"
        )}>
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="p-4 grid grid-cols-4 gap-3 bg-[#f8f8f8]">
        {buttons.map((btn, i) => {
          const Icon = btn.icon;
          return (
            <button
              key={i}
              onClick={btn.onClick}
              className={cn(
                "h-16 rounded-2xl flex items-center justify-center text-xl font-semibold transition-all active:scale-95",
                btn.type === 'number' && "bg-white text-[#141414] hover:bg-[#141414]/5 shadow-sm",
                btn.type === 'operator' && "bg-[#FF6321]/10 text-[#FF6321] hover:bg-[#FF6321]/20",
                btn.type === 'action' && "bg-[#141414]/5 text-[#141414] hover:bg-[#141414]/10",
                btn.type === 'equals' && "bg-[#FF6321] text-white hover:bg-[#FF834B] shadow-lg shadow-[#FF6321]/20",
                btn.className
              )}
            >
              {Icon ? <Icon size={24} /> : btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
