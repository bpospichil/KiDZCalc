import React from 'react';
import { GameStats, Difficulty } from '../types';
import { getAchievements } from '../utils/problemGenerator';
import { X, Trophy, Star, Flame, Award, ShieldCheck, Zap } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  difficulty: Difficulty;
  onChangeDifficulty: (diff: Difficulty) => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  difficulty,
  onChangeDifficulty,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const achievements = getAchievements();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-stone-900 border-4 border-amber-600/60 rounded-2xl p-5 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-600/30">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold font-sans text-amber-300">KidZCalc Stats & Trophies</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Summary Stats Cards */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-xs text-amber-300 font-sans">Level</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">{stats.level}</span>
          </div>
          <div className="bg-orange-950/40 border border-orange-500/30 p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-xs text-orange-300 font-sans">Best Streak</span>
            <span className="text-2xl font-bold text-orange-400 font-mono flex items-center gap-1">
              <Flame className="w-5 h-5 inline text-orange-400" /> {stats.bestStreak}
            </span>
          </div>
          <div className="bg-yellow-950/40 border border-yellow-500/30 p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-xs text-yellow-300 font-sans">Total Solved</span>
            <span className="text-2xl font-bold text-yellow-400 font-mono flex items-center gap-1">
              <Star className="w-5 h-5 inline text-yellow-400" /> {stats.totalSolved}
            </span>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="my-4 bg-stone-800/80 p-3 rounded-xl border border-stone-700">
          <label className="text-xs font-bold text-amber-300 block mb-2 font-sans flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-400" /> Math Difficulty Range:
          </label>
          <div className="grid grid-cols-4 gap-1.5 font-sans text-xs">
            {(['easy', 'medium', 'hard', 'master'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => onChangeDifficulty(d)}
                className={`py-2 px-1 rounded-lg font-bold capitalize transition ${
                  difficulty === d
                    ? 'bg-amber-500 text-stone-950 shadow'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                {d === 'easy' && '1-10'}
                {d === 'medium' && '1-20'}
                {d === 'hard' && '1-50'}
                {d === 'master' && '1-100'}
              </button>
            ))}
          </div>
        </div>

        {/* Badges / Achievements List */}
        <div className="my-4">
          <h3 className="text-sm font-bold text-stone-200 mb-2 font-sans flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Earned Badges & Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {achievements.map((ach) => {
              const isUnlocked = stats.unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 transition ${
                    isUnlocked
                      ? 'bg-amber-950/30 border-amber-500/40 text-stone-100'
                      : 'bg-stone-800/40 border-stone-800 text-stone-500 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs flex items-center gap-1">
                      <span>{ach.title}</span>
                      {isUnlocked && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">{ach.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 font-sans">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> 100% Offline • Free • No Ads
          </span>
          <button
            onClick={onResetStats}
            className="text-red-400 hover:underline text-xs"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};
