import React from 'react';
import { Problem } from '../types';
import { HelpCircle, X } from 'lucide-react';

interface VisualBlockHelperProps {
  problem: Problem;
  isOpen: boolean;
  onClose: () => void;
}

export const VisualBlockHelper: React.FC<VisualBlockHelperProps> = ({ problem, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Render block items for a given number
  const renderBlocks = (count: number, isMissing: boolean, label: string) => {
    return (
      <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-black/40 border border-white/10 min-w-[5rem]">
        <span className="text-xs font-bold text-amber-300 font-sans">{label}</span>
        <div className="flex flex-wrap gap-1 max-w-[120px] justify-center min-h-[2.5rem] items-center">
          {Array.from({ length: Math.min(count, 30) }).map((_, idx) => (
            <div
              key={idx}
              className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-110 ${
                isMissing
                  ? 'bg-amber-500/80 text-amber-950 border border-amber-300 animate-pulse'
                  : 'bg-emerald-600 text-emerald-100 border border-emerald-400'
              }`}
            >
              🟩
            </div>
          ))}
          {count > 30 && <span className="text-xs text-white/60">+{count - 30}</span>}
        </div>
        <span className="text-lg font-bold font-mono text-white">
          {isMissing ? '?' : count}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-stone-900 border-4 border-emerald-600/60 rounded-2xl p-5 text-white shadow-2xl relative">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-emerald-300 font-sans">Block Counter Visualizer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-300 my-3 font-sans">
          Count the grass blocks to find the missing number!
        </p>

        <div className="flex items-center justify-center gap-2 flex-wrap my-4">
          {renderBlocks(problem.op1, problem.missingSlot === 'op1', 'First Group')}

          <span className="text-2xl font-black text-amber-400 font-mono">
            {problem.operator}
          </span>

          {renderBlocks(problem.op2, problem.missingSlot === 'op2', 'Second Group')}

          <span className="text-2xl font-black text-amber-400 font-mono">=</span>

          {renderBlocks(problem.result, problem.missingSlot === 'result', 'Total Result')}
        </div>

        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30 text-xs font-sans text-emerald-200">
          💡 <strong>Kid Tip:</strong>{' '}
          {problem.operator === '+'
            ? 'Add both groups together to get the total!'
            : 'Start with the total and take away blocks to find what remains!'}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm transition"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};
