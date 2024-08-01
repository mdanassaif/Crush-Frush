// Define difficulty levels
export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Expert = 'expert'
}

// Define candy types
const baseCandyTypes = ['R', 'B', 'G', 'Y', 'P'];
const advancedCandyTypes = ['O', 'V']; // Orange and Violet

export const generateBoard = (rows: number, cols: number, difficulty: Difficulty): string[][] => {
  let candyTypes = [...baseCandyTypes];
  
  if (difficulty === Difficulty.Hard || difficulty === Difficulty.Expert) {
    candyTypes = [...candyTypes, ...advancedCandyTypes];
  }

  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => candyTypes[Math.floor(Math.random() * candyTypes.length)])
  );
};

export const checkMatches = (board: string[][], difficulty: Difficulty): [number, number][] => {
  const matches: [number, number][] = [];
  const minMatch = difficulty === Difficulty.Easy ? 3 : 4;

  // Check horizontal matches
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length - (minMatch - 1); col++) {
      if (board[row][col] && 
          Array.from({ length: minMatch }, (_, i) => board[row][col + i]).every(candy => candy === board[row][col])) {
        for (let i = 0; i < minMatch; i++) {
          matches.push([row, col + i]);
        }
      }
    }
  }

  // Check vertical matches
  for (let row = 0; row < board.length - (minMatch - 1); row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] && 
          Array.from({ length: minMatch }, (_, i) => board[row + i][col]).every(candy => candy === board[row][col])) {
        for (let i = 0; i < minMatch; i++) {
          matches.push([row + i, col]);
        }
      }
    }
  }

  return matches;
};

export const applyGravity = (board: string[][], difficulty: Difficulty): string[][] => {
  const newBoard = board.map(row => [...row]);
  let candyTypes = [...baseCandyTypes];
  
  if (difficulty === Difficulty.Hard || difficulty === Difficulty.Expert) {
    candyTypes = [...candyTypes, ...advancedCandyTypes];
  }

  for (let col = 0; col < newBoard[0].length; col++) {
    let emptySpaces = 0;
    for (let row = newBoard.length - 1; row >= 0; row--) {
      if (newBoard[row][col] === '') {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        newBoard[row + emptySpaces][col] = newBoard[row][col];
        newBoard[row][col] = '';
      }
    }
    for (let row = 0; row < emptySpaces; row++) {
      newBoard[row][col] = candyTypes[Math.floor(Math.random() * candyTypes.length)];
    }
  }

  return newBoard;
};

export const swapCandies = (board: string[][], row1: number, col1: number, row2: number, col2: number): string[][] => {
  const newBoard = board.map(row => [...row]);
  [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
  return newBoard;
};

export const findPossibleMoves = (board: string[][], difficulty: Difficulty): [number, number, number, number][] => {
  const moves: [number, number, number, number][] = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // Check horizontal swap
      if (col < board[row].length - 1) {
        const swappedBoard = swapCandies(board, row, col, row, col + 1);
        if (checkMatches(swappedBoard, difficulty).length > 0) {
          moves.push([row, col, row, col + 1]);
        }
      }
      // Check vertical swap
      if (row < board.length - 1) {
        const swappedBoard = swapCandies(board, row, col, row + 1, col);
        if (checkMatches(swappedBoard, difficulty).length > 0) {
          moves.push([row, col, row + 1, col]);
        }
      }
    }
  }

  // For expert difficulty, limit the number of possible moves
  if (difficulty === Difficulty.Expert) {
    return moves.slice(0, Math.max(1, Math.floor(moves.length / 3)));
  }

  return moves;
};

// New function to create special candies
export const createSpecialCandy = (type: string, matchLength: number): string => {
  if (matchLength >= 5) {
    return `${type}_COLOR_BOMB`;
  } else if (matchLength === 4) {
    return `${type}_STRIPED`;
  }
  return type;
};