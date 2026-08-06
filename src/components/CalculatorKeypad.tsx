import React from 'react';
import { SkinConfig } from '../types';
import { Delete, CheckCircle, Palette, Music, VolumeX } from 'lucide-react';

interface CalculatorKeypadProps {
  skin: SkinConfig;
  onNumClick: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onSubmit: () => void;
  onOpenSkins: () => void;
  onToggleMusic: () => void;
  isMusicPlaying: boolean;
  opFilter: 'add' | 'sub' | 'mixed';
  onChangeOpFilter: (op: 'add' | 'sub' | 'mixed') => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  skin,
  onNumClick,
  onDelete,
  onClear,
  onSubmit,
  onOpenSkins,
  onToggleMusic,
  isMusicPlaying,
  opFilter,
  onChangeOpFilter,
}) => {
  // Keypad Layout (Standard calculator arrangement)
  const rows = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
  ];

  return (
    <div className={`w-full ${skin.keypadBg} flex flex-col gap-3 rounded-2xl select-none mt-3`}>
      {/* Quick Settings & Operations Toggle Bar */}
      <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl text-xs font-sans gap-1">
        {/* Operations Switcher */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg">
          <button
            onClick={() => onChangeOpFilter('mixed')}
            className={`px-2 py-1 rounded font-bold transition ${
              opFilter === 'mixed'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            + & -
          </button>
          <button
            onClick={() => onChangeOpFilter('add')}
            className={`px-2 py-1 rounded font-bold transition ${
              opFilter === 'add'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            + Only
          </button>
          <button
            onClick={() => onChangeOpFilter('sub')}
            className={`px-2 py-1 rounded font-bold transition ${
              opFilter === 'sub'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            - Only
          </button>
        </div>

        {/* Audio & Skin Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-lg border transition flex items-center justify-center ${
              isMusicPlaying
                ? 'bg-emerald-600/80 border-emerald-400 text-white'
                : 'bg-black/40 border-white/20 text-white/60 hover:text-white'
            }`}
            title="Toggle Chiptune Music"
          >
            {isMusicPlaying ? <Music className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSkins}
            className="p-2 rounded-lg bg-black/40 border border-white/20 hover:border-amber-400 text-amber-300 transition flex items-center gap-1 font-bold"
            title="Change Calculator Skin"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Skin</span>
          </button>
        </div>
      </div>

      {/* Main Buttons Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3" style={{ fontFamily: skin.fontFamily }}>
        {/* Row 1, 2, 3: Number pad + Action buttons on right */}
        {rows.map((row, rIdx) => (
          <React.Fragment key={`row-${rIdx}`}>
            {row.map((num) => (
              <button
                key={`btn-${num}`}
                onClick={() => onNumClick(num)}
                className={`h-14 sm:h-16 rounded-xl text-xl sm:text-2xl font-bold flex items-center justify-center transition-transform active:scale-95 ${skin.numBtn}`}
              >
                {num}
              </button>
            ))}

            {/* Right Column Action Keys */}
            {rIdx === 0 && (
              <button
                onClick={onClear}
                className={`h-14 sm:h-16 rounded-xl text-lg font-bold flex items-center justify-center transition-transform active:scale-95 ${skin.actionBtn}`}
                title="Clear input"
              >
                C
              </button>
            )}

            {rIdx === 1 && (
              <button
                onClick={onDelete}
                className={`h-14 sm:h-16 rounded-xl text-lg font-bold flex items-center justify-center transition-transform active:scale-95 ${skin.actionBtn}`}
                title="Delete last digit"
              >
                <Delete className="w-6 h-6" />
              </button>
            )}

            {rIdx === 2 && (
              <div className="h-14 sm:h-16 flex items-center justify-center">
                <span className="text-white/20 text-xs font-mono">KidZ</span>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Bottom Row: 0, Extra span, ENTER / VERIFY key */}
        <button
          onClick={() => onNumClick('0')}
          className={`h-14 sm:h-16 rounded-xl text-xl sm:text-2xl font-bold col-span-2 flex items-center justify-center transition-transform active:scale-95 ${skin.numBtn}`}
        >
          0
        </button>

        {/* ENTER / VERIFY Key */}
        <button
          onClick={onSubmit}
          className={`h-14 sm:h-16 rounded-xl text-lg sm:text-xl font-extrabold col-span-2 flex items-center justify-center gap-2 transition-transform active:scale-95 ${skin.enterBtn}`}
        >
          <CheckCircle className="w-5 h-5" />
          <span>ENTER</span>
        </button>
      </div>
    </div>
  );
};
