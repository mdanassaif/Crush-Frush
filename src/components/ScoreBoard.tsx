interface ScoreBoardProps {
    score: number;
    movesLeft: number;
  }
  
  const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, movesLeft }) => {
    return (
      <div className="flex justify-between mb-4 text-xl font-bold">
        <div>Score: {score}</div>
        <div>Moves Left: {movesLeft}</div>
      </div>
    );
  };
  
  export default ScoreBoard;