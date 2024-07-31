'use client';

import { useState, useEffect } from 'react';
import Board from '../components/Board';
import LevelInfo from '../components/LevelInfo';
import ScoreBoard from '../components/ScoreBoard';
import { levels } from '../utils/levelData';


export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(levels[0].moves);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'complete' | 'failed'>('complete');

  useEffect(() => {
    setMovesLeft(levels[currentLevel - 1].moves);
    setScore(0);
  }, [currentLevel]);

  const handleLevelComplete = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      alert("Congratulations! You've completed all levels!");
    }
  };

  const handleMove = () => {
    if (movesLeft > 0) {
      setMovesLeft(movesLeft - 1);
      if (movesLeft === 1) {
        // This was the last move
        setModalType('failed');
        setShowModal(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-400 to-pink-500">
      <h1 className="text-6xl font-bold mb-8 text-white shadow-lg">Candy Crush Clone</h1>
      <div className="bg-white rounded-lg p-8 shadow-2xl">
        <LevelInfo level={currentLevel} objective={levels[currentLevel - 1].objective as { [key: string]: number }} />
        <ScoreBoard score={score} movesLeft={movesLeft} />
        <Board 
          level={currentLevel}
          onScoreUpdate={(points) => setScore(score + points)}
          onMove={handleMove}
          onLevelComplete={() => {
            setModalType('complete');
            setShowModal(true);
          }}
          showModal={showModal}
          setShowModal={setShowModal}
          modalType={modalType}
          onNextLevel={handleLevelComplete}
          onRetry={() => {
            setMovesLeft(levels[currentLevel - 1].moves);
            setScore(0);
          }}
        />
      </div>
    </div>
  );
}