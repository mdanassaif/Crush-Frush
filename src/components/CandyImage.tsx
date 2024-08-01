// components/CandyImage.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CandyImageProps {
  type: string;
  width: number;
  height: number;
}

const candyImages: { [key: string]: string } = {
    R: '/red.png',
    B: '/blue.png',
    G: '/green.png',
    Y: '/yellow.png',
    P: '/purple.png',
};

const CandyImage: React.FC<CandyImageProps> = ({ type, width, height }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setLoaded(true);
    img.src = candyImages[type];
  }, [type]);

  return (
    <>
      {!loaded && (
        <div 
          className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full"
          style={{ width, height }}
        >
          <span className="text-2xl font-bold">{type}</span>
        </div>
      )}
      <Image
        src={candyImages[type]}
        alt={`${type} candy`}
        width={width}
        height={height}
        className={`w-full h-full object-contain ${loaded ? 'block' : 'hidden'}`}
      />
    </>
  );
};

export default CandyImage;