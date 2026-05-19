import { useState } from 'react';
import { evaluate, pi, e } from 'mathjs';
import { Delete, RotateCcw, Equal } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScientificCalcProps {
  addToHistory: (expression: string, result: string) => void;
}

export default function ScientificCalc({ addToHistory }: ScientificCalcProps) {
  const [display, setDisplay] = useState('0');
  const [isResult, setIsResult] = useState(false);

  const handleClear = () => {
    setDisplay('0');
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

  const handleInput = (val: string) => {
    if (isResult) {
      setDisplay(val);
      setIsResult(false);
      return;
    }
    if (display === '0') {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const handleEqual = () => {
    try {
      // Replace safe functions/symbols for mathjs
      const mathExpr = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt')
        .replace(/²/, '^2')
        .replace(/³/g, '^3')
        .replace(/log/g, 'log10')
        .replace(/ln/g, 'log');

      const result = evaluate(mathExpr);
      const resultString = result.toString();
      
      addToHistory(display, resultString);
      setDisplay(resultString);
      setIsResult(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const btnGroups = [
    // Sci functions
    ['sin(', 'cos(', 'tan(', 'pi', 'e'],
    ['log(', 'ln(', '√(', '(', ')'],
    ['^', '²', '³', 'abs(', '!'],
    // Standard num/ops
    ['7', '8', '9', '÷', 'DEL'],
    ['4', '5', '6', '×', 'C'],
    ['1', '2', '3', '-', '+'],
    ['0', '.', '=', 'asin(', 'acos(']
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#141414]/10 w-full max-w-2xl mx-auto">
      {/* Display Screen */}
      <div className="bg-[#141414] p-8 flex flex-col items-end justify-end min-h-[160px] text-white">
        <div className={cn(
          "font-mono font-bold leading-none break-all text-right transition-all",
          display.length > 20 ? "text-2xl" : "text-4xl"
        )}>
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="p-4 grid grid-cols-5 gap-2 bg-[#f8f8f8]">
        {btnGroups.flat().map((btn, i) => {
          let onClick = () => handleInput(btn);
          let className = "bg-white text-[#141414] hover:bg-[#141414]/5 text-sm md:text-base";
          let label = btn;

          if (btn === '=') {
            onClick = handleEqual;
            className = "bg-[#FF6321] text-white hover:bg-[#FF834B] shadow-lg shadow-[#FF6321]/20";
          } else if (btn === 'C') {
            onClick = handleClear;
            className = "bg-red-50 text-red-500 hover:bg-red-100";
            label = "AC";
          } else if (btn === 'DEL') {
            onClick = handleDelete;
            className = "bg-[#141414]/5 text-[#141414] hover:bg-[#141414]/10";
          } else if (['+', '-', '×', '÷'].includes(btn)) {
            className = "bg-[#FF6321]/10 text-[#FF6321] hover:bg-[#FF6321]/20";
          } else if (btn.length > 1 && !['pi', 'e'].includes(btn)) {
            className = "bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold uppercase";
          }

          return (
            <button
              key={i}
              onClick={onClick}
              className={cn(
                "h-14 md:h-16 rounded-xl flex items-center justify-center font-semibold transition-all active:scale-95",
                className
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-white border-t border-[#141414]/5 text-[10px] uppercase tracking-widest text-[#141414]/40 font-bold text-center">
        Mode Ilmiah Profesional • Radian Mode
      </div>
    </div>
  );
}
