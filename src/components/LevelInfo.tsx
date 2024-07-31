interface LevelInfoProps {
  level: number;
  objective: { [key: string]: number };
}

const LevelInfo: React.FC<LevelInfoProps> = ({ level, objective }) => {
  return (
    <div className="mb-4 text-2xl font-bold text-center">
      <h2 className="text-3xl mb-2">Level {level}</h2>
      <div className="text-xl">
        Objective:
        {Object.entries(objective).map(([color, count]) => (
          <span key={color} className="ml-2">
            {color}: {count}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LevelInfo;