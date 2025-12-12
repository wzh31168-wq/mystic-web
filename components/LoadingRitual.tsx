import React, { useEffect, useState } from 'react';

const phrases = [
  "凝神定氣...",
  "默念生辰...",
  "搖動筮筒...",
  "天垂卦象...",
  "易聖推演..."
];

const LoadingRitual: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-96 w-full space-y-12 animate-fade-in">
      
      {/* Bamboo Divination Cylinder Animation */}
      <div className="relative">
        {/* The Cylinder */}
        <div className="w-24 h-40 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 border-x-2 border-stone-900 rounded-b-lg relative overflow-hidden animate-shake origin-bottom">
           {/* Wood texture lines */}
           <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_3px)]"></div>
           {/* Decorative Band */}
           <div className="absolute top-10 w-full h-4 bg-withered-gold opacity-80"></div>
           
           {/* Sticks inside (partially visible) */}
           <div className="absolute top-0 left-0 w-full h-full flex justify-center items-end px-4">
              <div className="w-1 h-32 bg-yellow-900/50 mx-1 transform translate-y-4"></div>
              <div className="w-1 h-36 bg-yellow-900/50 mx-1 transform translate-y-2"></div>
              <div className="w-1 h-30 bg-yellow-900/50 mx-1 transform translate-y-6"></div>
           </div>
        </div>
        
        {/* The Flying Stick (Result) */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-3 h-32 bg-[#d4a045] border border-yellow-900 rounded-t shadow-lg animate-slide-up flex flex-col items-center justify-center">
            {/* Red Paint on stick */}
            <div className="text-[8px] text-red-800 font-bold writing-vertical-rl pt-2 opacity-80 vertical-text">
                上上吉
            </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="text-withered-gold text-2xl font-serif tracking-[0.2em] font-bold">
          {phrases[phraseIndex]}
        </div>
        <p className="text-stone-500 text-xs tracking-widest uppercase">Takashima Ekidan Processing</p>
      </div>
    </div>
  );
};

export default LoadingRitual;