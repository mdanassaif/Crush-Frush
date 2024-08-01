// components/Candy.tsx
import { motion } from 'framer-motion';
import CandyImage from './CandyImage';

interface CandyProps {
  type: string;
  onMouseDown: () => void;
  isSelected: boolean;
  isMatched: boolean;
}

const Candy: React.FC<CandyProps> = ({ type, onMouseDown, isSelected, isMatched }) => {
  return (
    <motion.div
      className={`w-full h-full ${isSelected ? 'ring-4 ring-white' : ''} cursor-pointer`}
      onMouseDown={onMouseDown}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: isMatched ? [1, 1.2, 1] : 1,
        rotate: isMatched ? [0, 360, 0] : 0,
        opacity: isMatched ? [1, 0.5, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        repeat: isMatched ? Infinity : 0,
        repeatType: "loop"
      }}
    >
      <CandyImage type={type} width={60} height={60} />
    </motion.div>
  );
};

export default Candy;


