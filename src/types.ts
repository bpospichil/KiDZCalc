export type Operation = 'add' | 'sub' | 'mixed';

export type MissingSlot = 'op1' | 'op2' | 'result';

export interface Problem {
  id: string;
  op1: number;
  op2: number;
  operator: '+' | '-';
  result: number;
  missingSlot: MissingSlot;
  correctAnswer: number;
}

export type SkinTheme = 'minecraft' | 'gameboy' | 'candy' | 'space' | 'chalkboard';

export interface SkinConfig {
  id: SkinTheme;
  name: string;
  subtitle: string;
  bgGradient: string;
  frameBg: string;
  frameBorder: string;
  displayBg: string;
  displayText: string;
  displayMissingBorder: string;
  keypadBg: string;
  numBtn: string;
  numBtnText: string;
  actionBtn: string;
  actionBtnText: string;
  enterBtn: string;
  enterBtnText: string;
  fontFamily: string;
  pixelStyle?: boolean;
}

export type GameMode = 'classic' | 'timed' | 'streak';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export interface GameStats {
  totalSolved: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  stars: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reqType: 'solved' | 'streak' | 'stars' | 'level';
  reqValue: number;
}
