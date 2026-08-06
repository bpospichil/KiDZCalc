import React from 'react';
import { Problem, SkinConfig } from '../types';
import { Sparkles, Flame, Star, Trophy, HelpCircle } from 'lucide-react';

interface CalculatorDisplayProps {
  problem: Problem;
  userInput: string;
  skin: SkinConfig;
  feedback: 'idle' | 'correct' | 'wrong';
  streak: number;
  stars: number;
  level: number;
  xp: number;
  xpToNext: number;
  onOpenVisualHelper: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  problem,
  userInput,
  skin,
  feedback,
  streak,
  stars,
  level,
  xp,
  xpToNext,
  onOpenVisualHelper,
}) => {
  // Render the equation with the missing slot highlighted
  const renderSlot = (slotType: 'op1' | 'op2' | 'result', val: number) => {
    const isMissing = problem.missingSlot === slotType;

    if (!isMissing) {
      return (
        <span className="inline-block px-2 sm:px-3 py-1 font-bold text-xl sm:text-3xl">
          {val}
        </span>
      );
    }

    // Missing Slot
    const displayValue = userInput !== '' ? userInput : '?';
    const animationClass =
      feedback === 'wrong'
        ? 'animate-shake border-red-500 bg-red-950/80'
        : feedback === 'correct'
        ? 'scale-110 border-emerald-300 bg-emerald-900 text-emerald-200 transition-transform duration-300'
        : skin.displayMissingBorder;

    return (
      <div
        key={`slot-${problem.id}`}
        className={`inline-flex items-center justify-center min-w-[3.5rem] sm:min-w-[4.5rem] h-11 sm:h-14 px-3 rounded-lg border-2 sm:border-4 ${animationClass} font-extrabold text-2xl sm:text-4xl shadow-inner relative transition-all duration-200`}
      >
        <span>{displayValue}</span>
        {userInput === '' && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative w-full rounded-2xl p-4 sm:p-5 ${skin.displayBg} shadow-2xl transition-all duration-300 overflow-hidden select-none`}
      style={{ fontFamily: skin.fontFamily }}
    >
      {/* Top Bar: Level, Stars, Streak */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold opacity-90 mb-3 border-b border-white/10 pb-2 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300 font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Lvl {level}
          </span>
          <div className="w-12 sm:w-20 bg-black/40 h-2 rounded-full overflow-hidden border border-white/10 shrink-0">
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / xpToNext) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {streak > 1 && (
            <span className="flex items-center gap-1 text-orange-400 font-bold bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30 animate-pulse whitespace-nowrap shrink-0">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-500 shrink-0" />
              {streak}x
            </span>
          )}

          <div className="flex items-center gap-1 text-amber-300 font-bold whitespace-nowrap shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
            <span>{stars}</span>
          </div>
        </div>
      </div>

      {/* Main Equation Display */}
      <div className="my-4 sm:my-6 flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap min-h-[3.5rem]">
        {renderSlot('op1', problem.op1)}
        <span className="text-2xl sm:text-4xl font-black opacity-80">
          {problem.operator}
        </span>
        {renderSlot('op2', problem.op2)}
        <span className="text-2xl sm:text-4xl font-black opacity-80">=</span>
        {renderSlot('result', problem.result)}
      </div>

      {/* Feedback & Visual Helper bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm mt-2 pt-2 border-t border-white/10 min-h-[2rem]">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVisualHelper}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/30 transition text-amber-200 text-xs font-sans font-medium"
            title="Show Block Count Visualizer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Count Helper</span>
          </button>
        </div>

        <div>
          {feedback === 'correct' ? (
            <div className="text-emerald-400 font-bold flex items-center gap-1 text-xs sm:text-sm animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>AWESOME! +10 XP</span>
            </div>
          ) : feedback === 'wrong' ? (
            <div className="text-red-400 font-bold text-xs sm:text-sm animate-shake">
              TRY AGAIN!
            </div>
          ) : (
            <div className="text-white/60 text-xs italic font-sans">
              Type answer & press <span className="font-bold underline text-white">ENTER</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
