import Image from 'next/image';
import { motion } from 'framer-motion';

interface CandyProps {
  type: string;
  onMouseDown: () => void;
  isSelected: boolean;
}

const Candy: React.FC<CandyProps> = ({ type, onMouseDown, isSelected }) => {
  const candyImages: { [key: string]: string } = {
    R: '/red.png',
    B: '/blue.png',
    G: '/green.png',
    Y: '/yellow.png',
    P: '/purple.png',
  };

  return (
    <motion.div
      className={`w-full h-full ${isSelected ? 'ring-4 ring-white' : ''} cursor-pointer`}
      onMouseDown={onMouseDown}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Image
        src={candyImages[type]}
        alt={`${type} candy`}
        width={60}
        height={60}
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};

export default Candy;