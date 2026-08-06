import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Difficulty,
  GameStats,
  Operation,
  Problem,
  SkinTheme,
} from './types';
import { SKINS } from './data/skins';
import { generateProblem, getAchievements } from './utils/problemGenerator';
import { audioEngine } from './utils/audioEngine';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { SkinSelectorModal } from './components/SkinSelectorModal';
import { VisualBlockHelper } from './components/VisualBlockHelper';
import { StatsModal } from './components/StatsModal';
import {
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Smartphone,
  Trophy,
  Palette,
  Sparkles,
  RefreshCw,
  Info,
  ShieldCheck,
  Award,
} from 'lucide-react';

const INITIAL_STATS: GameStats = {
  totalSolved: 0,
  totalAttempted: 0,
  currentStreak: 0,
  bestStreak: 0,
  stars: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 50,
  unlockedAchievements: [],
};

export default function App() {
  // Load saved state or defaults
  const [currentSkinTheme, setCurrentSkinTheme] = useState<SkinTheme>(() => {
    const saved = localStorage.getItem('kidzcalc_skin');
    return (saved as SkinTheme) || 'minecraft';
  });

  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('kidzcalc_diff');
    return (saved as Difficulty) || 'easy';
  });

  const [opFilter, setOpFilter] = useState<Operation>(() => {
    const saved = localStorage.getItem('kidzcalc_op');
    return (saved as Operation) || 'mixed';
  });

  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('kidzcalc_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_STATS;
  });

  // Current problem state
  const [problem, setProblem] = useState<Problem>(() =>
    generateProblem(difficulty, opFilter)
  );

  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Audio / Music state
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [currentTrackName, setCurrentTrackName] = useState<string>(audioEngine.getCurrentTrackName());

  // Auto-start BGM on first screen interaction if enabled
  useEffect(() => {
    const handleFirstInteraction = () => {
      const bgmSaved = localStorage.getItem('kidzcalc_bgm_enabled');
      const isEnabled = bgmSaved === null || bgmSaved === 'true';

      if (isEnabled && !audioEngine.getIsMusicPlaying()) {
        audioEngine.startMusic('chiptune1');
        setIsMusicPlaying(true);
        setCurrentTrackName(audioEngine.getCurrentTrackName());
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Toggle Chiptune Music (cycles to the next song each time turned back on)
  const handleToggleMusic = () => {
    const result = audioEngine.toggleMusic();
    setIsMusicPlaying(result.isPlaying);
    setCurrentTrackName(result.trackName);
    localStorage.setItem('kidzcalc_bgm_enabled', result.isPlaying ? 'true' : 'false');
  };
  const [isSkinsOpen, setIsSkinsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isVisualHelperOpen, setIsVisualHelperOpen] = useState<boolean>(false);

  const skin = SKINS[currentSkinTheme] || SKINS.minecraft;

  // Save stats & settings
  useEffect(() => {
    localStorage.setItem('kidzcalc_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('kidzcalc_skin', currentSkinTheme);
  }, [currentSkinTheme]);

  useEffect(() => {
    localStorage.setItem('kidzcalc_diff', difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('kidzcalc_op', opFilter);
  }, [opFilter]);

  // Load new problem when difficulty or op filter changes
  const nextQuestion = useCallback(() => {
    setUserInput('');
    setFeedback('idle');
    setProblem(generateProblem(difficulty, opFilter));
  }, [difficulty, opFilter]);

  // Check achievements against current stats
  const checkAchievements = (newStats: GameStats) => {
    const allAchievements = getAchievements();
    const newUnlocked = [...newStats.unlockedAchievements];

    allAchievements.forEach((ach) => {
      if (!newUnlocked.includes(ach.id)) {
        let unlocked = false;
        if (ach.reqType === 'solved' && newStats.totalSolved >= ach.reqValue) unlocked = true;
        if (ach.reqType === 'streak' && newStats.currentStreak >= ach.reqValue) unlocked = true;
        if (ach.reqType === 'level' && newStats.level >= ach.reqValue) unlocked = true;
        if (ach.reqType === 'stars' && newStats.stars >= ach.reqValue) unlocked = true;

        if (unlocked) {
          newUnlocked.push(ach.id);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
      }
    });

    return newUnlocked;
  };

  // Submit Answer Verification
  const handleSubmit = useCallback(() => {
    if (userInput === '' || feedback !== 'idle') return;

    const parsedNum = parseInt(userInput, 10);
    const isCorrect = parsedNum === problem.correctAnswer;

    if (isCorrect) {
      audioEngine.playCorrect();
      setFeedback('correct');

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#81D4FA', '#FFD700', '#FF5252'],
      });

      // Update stats
      setStats((prev) => {
        const nextSolved = prev.totalSolved + 1;
        const nextAttempted = prev.totalAttempted + 1;
        const nextStreak = prev.currentStreak + 1;
        const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
        const nextStars = prev.stars + (nextStreak % 5 === 0 ? 3 : 1);

        let nextXp = prev.xp + 10;
        let nextLvl = prev.level;
        let nextXpToNext = prev.xpToNextLevel;

        if (nextXp >= nextXpToNext) {
          nextLvl += 1;
          nextXp -= nextXpToNext;
          nextXpToNext = Math.floor(nextXpToNext * 1.25);
          audioEngine.playLevelUp();
        }

        const updatedStats: GameStats = {
          ...prev,
          totalSolved: nextSolved,
          totalAttempted: nextAttempted,
          currentStreak: nextStreak,
          bestStreak: nextBestStreak,
          stars: nextStars,
          level: nextLvl,
          xp: nextXp,
          xpToNextLevel: nextXpToNext,
        };

        updatedStats.unlockedAchievements = checkAchievements(updatedStats);
        return updatedStats;
      });

      // Automatically load new question after short delay
      setTimeout(() => {
        nextQuestion();
      }, 700);
    } else {
      audioEngine.playError();
      setFeedback('wrong');

      setStats((prev) => ({
        ...prev,
        totalAttempted: prev.totalAttempted + 1,
        currentStreak: 0,
      }));

      // Clear wrong input after delay so child can retry
      setTimeout(() => {
        setUserInput('');
        setFeedback('idle');
      }, 650);
    }
  }, [userInput, feedback, problem, nextQuestion]);

  // Keypad Handlers
  const handleNumClick = (digit: string) => {
    audioEngine.playClick();
    if (userInput.length >= 4) return; // limit 4 digits max
    setUserInput((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleDelete = () => {
    audioEngine.playClick();
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    audioEngine.playClear();
    setUserInput('');
  };

  // Physical Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSkinsOpen || isStatsOpen || isVisualHelperOpen) {
        if (e.key === 'Escape') {
          setIsSkinsOpen(false);
          setIsStatsOpen(false);
          setIsVisualHelperOpen(false);
        }
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        handleNumClick(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, isSkinsOpen, isStatsOpen, isVisualHelperOpen]);

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${skin.bgGradient} flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 transition-colors duration-500 font-sans antialiased`}
    >
      {/* App Header Bar for Desktop/Web View */}
      <header className="w-full max-w-md flex items-center justify-between py-2 px-3 text-white/90">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 border-2 border-emerald-300 flex items-center justify-center font-bold text-stone-950 text-base shadow">
            Z
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-amber-300 font-mono">
              KidZCalc
            </h1>
            <p className="text-[10px] text-white/70 font-sans">Math Calculator & Game</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMusic}
            className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-bold ${
              isMusicPlaying
                ? 'bg-emerald-600 text-white shadow animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white/70'
            }`}
            title={isMusicPlaying ? `Playing: ${currentTrackName} (Click to turn off)` : 'Click to turn on next BGM track'}
          >
            {isMusicPlaying ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-white/60" />}
            <span className="hidden sm:inline">{isMusicPlaying ? `🎵 ${currentTrackName}` : 'BGM OFF'}</span>
          </button>

          <button
            onClick={() => setIsStatsOpen(true)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition flex items-center gap-1 text-xs font-bold"
            title="Open Trophy Room & Settings"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          <button
            onClick={() => setIsSkinsOpen(true)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition flex items-center gap-1 text-xs font-bold"
            title="Choose Skin Theme"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Skins</span>
          </button>
        </div>
      </header>

      {/* Main Simulated Android Mobile Screen Container */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center my-auto">
        <div
          className={`w-full ${skin.frameBg} rounded-3xl p-3 sm:p-5 transition-all duration-300 relative`}
        >
          {/* Android Phone Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-white/80 pb-2.5 px-1 border-b border-white/10 mb-3 select-none">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-400">12:00</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                OFFLINE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">
                {skin.name}
              </span>
              <Wifi className="w-3.5 h-3.5 text-white/80" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Calculator Screen Display */}
          <CalculatorDisplay
            problem={problem}
            userInput={userInput}
            skin={skin}
            feedback={feedback}
            streak={stats.currentStreak}
            stars={stats.stars}
            level={stats.level}
            xp={stats.xp}
            xpToNext={stats.xpToNextLevel}
            onOpenVisualHelper={() => setIsVisualHelperOpen(true)}
          />

          {/* Calculator Keypad */}
          <CalculatorKeypad
            skin={skin}
            onNumClick={handleNumClick}
            onDelete={handleDelete}
            onClear={handleClear}
            onSubmit={handleSubmit}
            onOpenSkins={() => setIsSkinsOpen(true)}
            onToggleMusic={handleToggleMusic}
            isMusicPlaying={isMusicPlaying}
            opFilter={opFilter}
            onChangeOpFilter={(op) => {
              setOpFilter(op);
              nextQuestion();
            }}
          />

          {/* Android Navigation Bar */}
          <div className="flex items-center justify-center gap-8 pt-3 mt-1 opacity-60 text-white">
            <div className="w-3 h-3 border-l-2 border-b-2 border-white rotate-45" title="Back" />
            <div className="w-3.5 h-3.5 border-2 border-white rounded-full" title="Home" />
            <div className="w-3 h-3 border-2 border-white rounded-sm" title="Recents" />
          </div>
        </div>
      </main>

      {/* Footer Info Badge */}
      <footer className="w-full max-w-md py-2 text-center text-xs text-white/60 font-sans flex items-center justify-between px-2">
        <span className="flex items-center gap-1 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Free • Zero Ads • Kid Safe
        </span>
        <button
          onClick={nextQuestion}
          className="flex items-center gap-1 hover:text-white transition font-medium text-amber-300"
          title="Skip to next problem"
        >
          <RefreshCw className="w-3 h-3" />
          <span>New Problem</span>
        </button>
      </footer>

      {/* Modals & Visual Helpers */}
      <SkinSelectorModal
        isOpen={isSkinsOpen}
        onClose={() => setIsSkinsOpen(false)}
        currentSkin={currentSkinTheme}
        onSelectSkin={(s) => setCurrentSkinTheme(s)}
      />

      <VisualBlockHelper
        problem={problem}
        isOpen={isVisualHelperOpen}
        onClose={() => setIsVisualHelperOpen(false)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        difficulty={difficulty}
        onChangeDifficulty={(d) => {
          setDifficulty(d);
          nextQuestion();
        }}
        onResetStats={() => {
          if (confirm('Are you sure you want to reset all game stats and progress?')) {
            setStats(INITIAL_STATS);
          }
        }}
      />
    </div>
  );
}
