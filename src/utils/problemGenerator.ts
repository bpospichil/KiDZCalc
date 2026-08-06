import { Difficulty, MissingSlot, Operation, Problem } from '../types';

export function generateProblem(
  difficulty: Difficulty = 'easy',
  operationFilter: Operation = 'mixed',
  specificSlot?: MissingSlot
): Problem {
  // Determine upper bound based on difficulty
  let maxVal = 10;
  if (difficulty === 'medium') maxVal = 20;
  if (difficulty === 'hard') maxVal = 50;
  if (difficulty === 'master') maxVal = 100;

  // Decide operator ('+' or '-')
  let operator: '+' | '-' = '+';
  if (operationFilter === 'add') {
    operator = '+';
  } else if (operationFilter === 'sub') {
    operator = '-';
  } else {
    operator = Math.random() < 0.5 ? '+' : '-';
  }

  let op1 = 0;
  let op2 = 0;
  let result = 0;

  if (operator === '+') {
    // Addition: op1 + op2 = result
    // Keep sum <= maxVal
    result = Math.floor(Math.random() * (maxVal - 1)) + 2; // at least 2
    op1 = Math.floor(Math.random() * (result + 1));
    op2 = result - op1;
  } else {
    // Subtraction: op1 - op2 = result
    // CRITICAL: result must NEVER be negative!
    // So op1 >= op2 >= 0 and result = op1 - op2 >= 0.
    op1 = Math.floor(Math.random() * (maxVal - 1)) + 1; // 1 to maxVal
    op2 = Math.floor(Math.random() * (op1 + 1)); // 0 to op1 (ensures op1 - op2 >= 0)
    result = op1 - op2;
  }

  // Choose missing slot
  const slots: MissingSlot[] = ['op1', 'op2', 'result'];
  const missingSlot = specificSlot || slots[Math.floor(Math.random() * slots.length)];

  let correctAnswer = 0;
  if (missingSlot === 'op1') correctAnswer = op1;
  if (missingSlot === 'op2') correctAnswer = op2;
  if (missingSlot === 'result') correctAnswer = result;

  return {
    id: `prob_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    op1,
    op2,
    operator,
    result,
    missingSlot,
    correctAnswer,
  };
}

// Generate an achievement list definition
export function getAchievements() {
  return [
    {
      id: 'first_step',
      title: 'First Craft',
      description: 'Solve your very first math problem!',
      icon: '⛏️',
      reqType: 'solved',
      reqValue: 1,
    },
    {
      id: 'addition_ace',
      title: 'Addition Ace',
      description: 'Solve 10 addition problems',
      icon: '➕',
      reqType: 'solved',
      reqValue: 10,
    },
    {
      id: 'sub_wizard',
      title: 'Subtraction Wizard',
      description: 'Solve 25 total math problems',
      icon: '🧙',
      reqType: 'solved',
      reqValue: 25,
    },
    {
      id: 'streak_5',
      title: 'Block Chain',
      description: 'Reach a streak of 5 correct in a row',
      icon: '🔥',
      reqType: 'streak',
      reqValue: 5,
    },
    {
      id: 'streak_15',
      title: 'Unstoppable Miner',
      description: 'Reach a streak of 15 correct in a row',
      icon: '💎',
      reqType: 'streak',
      reqValue: 15,
    },
    {
      id: 'level_5',
      title: 'Level 5 Scholar',
      description: 'Reach KidZCalc Level 5',
      icon: '⭐',
      reqType: 'level',
      reqValue: 5,
    },
    {
      id: 'master_miner',
      title: 'Master Miner',
      description: 'Earn 100 stars',
      icon: '👑',
      reqType: 'stars',
      reqValue: 100,
    },
  ] as const;
}
