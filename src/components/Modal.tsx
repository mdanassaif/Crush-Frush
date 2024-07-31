import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'complete' | 'failed';
  onNextLevel: () => void;
  onRetry: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type, onNextLevel, onRetry }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              {type === 'complete' ? 'Level Complete!' : 'Level Failed!'}
            </h2>
            <p className="mb-6">
              {type === 'complete'
                ? 'Congratulations! You have completed this level.'
                : 'Oops! You ran out of moves. Try again?'}
            </p>
            <div className="flex justify-center space-x-4">
              {type === 'complete' ? (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    onNextLevel();
                    onClose();
                  }}
                >
                  Next Level
                </button>
              ) : (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    onRetry();
                    onClose();
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;