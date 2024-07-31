import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Candy from './Candy';
import Modal from './Modal';
import { generateBoard, checkMatches, applyGravity, swapCandies } from '../utils/gameLogic';
import { levels } from '../utils/levelData';

interface BoardProps {
  level: number;
  onScoreUpdate: (points: number) => void;
  onMove: () => void;
  onLevelComplete: () => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'complete' | 'failed';
  onNextLevel: () => void;
  onRetry: () => void;
}

const Board: React.FC<BoardProps> = ({
  level,
  onScoreUpdate,
  onMove,
  onLevelComplete,
  showModal,
  setShowModal,
  modalType,
  onNextLevel,
  onRetry
}) => {
  const [board, setBoard] = useState<string[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [objective, setObjective] = useState<{[key: string]: number}>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBoard(generateBoard(8, 8));
    setObjective(levels[level - 1].objective as { [key: string]: number });
  }, [level]);

  const handleCandyInteraction = async (row: number, col: number) => {
    if (isAnimating) return;
  
    if (!selected) {
      setSelected([row, col]);
    } else {
      const [selectedRow, selectedCol] = selected;
      if (
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row)
      ) {
        setIsAnimating(true);
        let newBoard = swapCandies(board, selectedRow, selectedCol, row, col);
        setBoard(newBoard);
  
        // Wait for the swap animation
        await new Promise(resolve => setTimeout(resolve, 300));
  
        let matches = checkMatches(newBoard);
        if (matches.length > 0) {
          // Valid move
          while (matches.length > 0) {
            let points = matches.length;
            onScoreUpdate(points);
  
            matches.forEach(([r, c]) => {
              if (objective[newBoard[r][c]] > 0) {
                objective[newBoard[r][c]]--;
              }
              newBoard[r][c] = '';
            });
  
            setBoard([...newBoard]);
            await new Promise(resolve => setTimeout(resolve, 300));
  
            newBoard = applyGravity(newBoard);
            setBoard([...newBoard]);
            await new Promise(resolve => setTimeout(resolve, 300));
  
            matches = checkMatches(newBoard);
          }
  
          setObjective({...objective});
          
          if (Object.values(objective).every(v => v === 0)) {
            onLevelComplete();
          }
          onMove();
        } else {
          // Invalid move, swap back
          console.log("Invalid move, swapping back");
          newBoard = swapCandies(newBoard, row, col, selectedRow, selectedCol);
          setBoard(newBoard);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        setIsAnimating(false);
      } else {
        // If the second click is not adjacent, treat it as a new selection
        setSelected([row, col]);
      }
    }
    setSelected(null);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const { clientX, clientY } = touch;
    const { row, col } = getTouchedCandy(clientX, clientY);
    if (row !== -1 && col !== -1) {
      handleCandyInteraction(row, col);
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!selected) return;
    
    const touch = event.touches[0];
    const { clientX, clientY } = touch;
    const { row, col } = getTouchedCandy(clientX, clientY);
    
    if (row !== -1 && col !== -1 && (row !== selected[0] || col !== selected[1])) {
      handleCandyInteraction(row, col);
    }
  };

  const getTouchedCandy = (clientX: number, clientY: number): { row: number; col: number } => {
    if (!boardRef.current) return { row: -1, col: -1 };

    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const cellWidth = rect.width / 8;
    const cellHeight = rect.height / 8;
    
    const row = Math.floor(y / cellHeight);
    const col = Math.floor(x / cellWidth);
    
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      return { row, col };
    }
    
    return { row: -1, col: -1 };
  };

  return (
    <>
      <div 
        ref={boardRef}
        className="grid grid-cols-8 gap-1 p-4 bg-blue-200 rounded-lg shadow-inner"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <AnimatePresence>
          {board.map((row, rowIndex) =>
            row.map((candy, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Candy
                  type={candy}
                  onClick={() => handleCandyInteraction(rowIndex, colIndex)}
                  isSelected={selected && selected[0] === rowIndex && selected[1] === colIndex}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        onNextLevel={() => {
          onNextLevel();
          setShowModal(false);
        }}
        onRetry={() => {
          onRetry();
          setBoard(generateBoard(8, 8));
          setObjective(levels[level - 1].objective as { [key: string]: number });
          setShowModal(false);
        }}
      />
    </>
  );
};

export default Board;