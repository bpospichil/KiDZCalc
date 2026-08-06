import React from 'react';
import { SkinTheme } from '../types';
import { SKINS } from '../data/skins';
import { X, Check, Sparkles } from 'lucide-react';

interface SkinSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkin: SkinTheme;
  onSelectSkin: (skin: SkinTheme) => void;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  isOpen,
  onClose,
  currentSkin,
  onSelectSkin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-stone-900 border-4 border-amber-600/60 rounded-2xl p-5 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-600/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold font-pixel text-amber-300">Calculator Skins</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-300 mt-2 font-sans">
          Choose your favorite look! Swap between Minecraft block textures, retro handheld LCDs, candies, space cyber neon, or classroom chalkboards.
        </p>

        {/* Skins List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {(Object.keys(SKINS) as SkinTheme[]).map((skinKey) => {
            const skin = SKINS[skinKey];
            const isSelected = currentSkin === skinKey;

            return (
              <button
                key={skinKey}
                onClick={() => {
                  onSelectSkin(skinKey);
                  onClose();
                }}
                className={`p-3.5 rounded-xl text-left border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-[1.02]'
                    : 'border-stone-700 bg-stone-800/80 hover:border-stone-500 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
                      {skin.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 font-sans">{skin.subtitle}</p>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-amber-400 text-stone-950">
                      <Check className="w-4 h-4 font-bold" />
                    </span>
                  )}
                </div>

                {/* Skin Mini Preview Bar */}
                <div className="mt-3 flex items-center gap-1.5 p-1.5 rounded-lg bg-black/40 border border-white/10">
                  <div className={`h-6 flex-1 rounded ${skin.displayBg} border border-white/20 flex items-center justify-center text-[10px] ${skin.displayText}`}>
                    5 + ? = 12
                  </div>
                  <div className={`h-6 w-8 rounded ${skin.numBtn} flex items-center justify-center text-[10px]`}>
                    7
                  </div>
                  <div className={`h-6 w-8 rounded ${skin.enterBtn} flex items-center justify-center text-[10px]`}>
                    =
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-stone-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm transition"
          >
            Done & Return to Game
          </button>
        </div>
      </div>
    </div>
  );
};
