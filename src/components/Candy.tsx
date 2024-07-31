import { motion } from 'framer-motion';

interface CandyProps {
  type: string;
  onClick: () => void;
  isSelected: boolean | null;
}

const Candy: React.FC<CandyProps> = ({ type, onClick, isSelected }) => {
  const candyColors: { [key: string]: string } = {
    R: 'bg-red-500',
    B: 'bg-blue-500',
    G: 'bg-green-500',
    Y: 'bg-yellow-500',
    P: 'bg-purple-500',
  };

  return (
    <motion.div
      key={type} // Add this to force re-render when type changes
      className={`w-full h-full aspect-square rounded-full ${candyColors[type]} ${
        isSelected ? 'ring-4 ring-white' : ''
      } cursor-pointer shadow-lg flex items-center justify-center`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="text-white font-bold text-2xl">
        {type}
      </div>
    </motion.div>
  );
};

export default Candy;