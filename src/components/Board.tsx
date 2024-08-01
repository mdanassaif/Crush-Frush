import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Candy from './Candy';
import Modal from './Modal';
import { generateBoard, checkMatches, applyGravity, swapCandies, findPossibleMoves } from '../utils/gameLogic';
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
  const [matchedCandies, setMatchedCandies] = useState<[number, number][]>([]);

  useEffect(() => {
    const candyTypes = ['R', 'B', 'G', 'Y', 'P'];
    candyTypes.forEach(type => {
      const img = new Image();
      img.src = `/${type.toLowerCase()}.png`;
    });
  }, []);

  

  useEffect(() => {
    const newBoard = generateBoard(8, 8);
    setBoard(newBoard);
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

        await new Promise(resolve => setTimeout(resolve, 300));

        let matches = checkMatches(newBoard);
        if (matches.length > 0) {
          while (matches.length > 0) {
            let points = matches.length;
            onScoreUpdate(points);

            setMatchedCandies(matches);
            await new Promise(resolve => setTimeout(resolve, 500));

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

            setMatchedCandies([]);
            matches = checkMatches(newBoard);
          }

          setObjective({...objective});
          
          if (Object.values(objective).every(v => v === 0)) {
            onLevelComplete();
          }
          onMove();
        } else {
          newBoard = swapCandies(newBoard, row, col, selectedRow, selectedCol);
          setBoard(newBoard);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        setIsAnimating(false);
      }
      setSelected(null);
    }
  };

  const handleMouseDown = (row: number, col: number) => {
    handleCandyInteraction(row, col);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const { row, col } = getTouchedCandy(touch.clientX, touch.clientY);
    if (row !== -1 && col !== -1) {
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
        className="grid grid-cols-8 gap-1 p-2 bg-pink-100 rounded-lg shadow-inner max-w-md mx-auto"
        style={{
          backgroundImage: "url('/board-background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onTouchStart={handleTouchStart}
      >
        <AnimatePresence>
          {board.map((row, rowIndex) =>
            row.map((candy, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  rotate: matchedCandies.some(([r, c]) => r === rowIndex && c === colIndex) ? 360 : 0,
                }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Candy
                  type={candy}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  isSelected={Boolean(selected && selected[0] === rowIndex && selected[1] === colIndex)}
                  isMatched={matchedCandies.some(([r, c]) => r === rowIndex && c === colIndex)}
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
        onNextLevel={onNextLevel}
        onRetry={onRetry}
      />
    </>
  );
};

export default Board;