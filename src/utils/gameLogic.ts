export const generateBoard = (rows: number, cols: number): string[][] => {
  const candyTypes = ['R', 'B', 'G', 'Y', 'P'];
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => candyTypes[Math.floor(Math.random() * candyTypes.length)])
  );
};

export const checkMatches = (board: string[][]): [number, number][] => {
  const matches: [number, number][] = [];

  // Check horizontal algo
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length - 2; col++) {
      if (
        board[row][col] &&
        board[row][col] === board[row][col + 1] &&
        board[row][col] === board[row][col + 2]
      ) {
        matches.push([row, col], [row, col + 1], [row, col + 2]);
      }
    }
  }

  // Check vertical algo
  for (let row = 0; row < board.length - 2; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (
        board[row][col] &&
        board[row][col] === board[row + 1][col] &&
        board[row][col] === board[row + 2][col]
      ) {
        matches.push([row, col], [row + 1, col], [row + 2, col]);
      }
    }
  }

  return matches;
};


export const applyGravity = (board: string[][]): string[][] => {
  const newBoard = board.map(row => [...row]);
  const candyTypes = ['R', 'B', 'G', 'Y', 'P'];

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

export const findPossibleMoves = (board: string[][]): [number, number, number, number][] => {
  const moves: [number, number, number, number][] = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // Check horizontal swap
      if (col < board[row].length - 1) {
        const swappedBoard = swapCandies(board, row, col, row, col + 1);
        if (checkMatches(swappedBoard).length > 0) {
          moves.push([row, col, row, col + 1]);
        }
      }
      // Check vertical swap
      if (row < board.length - 1) {
        const swappedBoard = swapCandies(board, row, col, row + 1, col);
        if (checkMatches(swappedBoard).length > 0) {
          moves.push([row, col, row + 1, col]);
        }
      }
    }
  }

  return moves;
};