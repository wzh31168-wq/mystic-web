import React from 'react';

interface ResultDisplayProps {
  content: string;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-6 text-stone-300 leading-loose tracking-wide font-serif text-lg">
      {lines.map((line, idx) => {
        const cleanLine = line.trim();
        if (!cleanLine) return <div key={idx} className="h-4" />;

        // H1 - Main Titles
        if (cleanLine.startsWith('# ')) {
          return (
            <div key={idx} className="flex items-center justify-center my-8">
                <div className="h-[1px] w-12 bg-withered-gold/50 mr-4"></div>
                <h1 className="text-3xl text-withered-gold font-bold tracking-[0.15em]">{cleanLine.replace('# ', '')}</h1>
                <div className="h-[1px] w-12 bg-withered-gold/50 ml-4"></div>
            </div>
          );
        }
        
        // H2 - Section Headers
        if (cleanLine.startsWith('## ') || cleanLine.startsWith('#### ')) {
            const content = cleanLine.replace(/#+\s/, '');
          return (
            <h2 key={idx} className="text-2xl text-withered-gold-light mt-8 mb-4 border-l-4 border-withered-gold pl-4 font-bold">
                {content}
            </h2>
          );
        }

        // H3
        if (cleanLine.startsWith('### ')) {
          return <h3 key={idx} className="text-xl text-withered-gold/80 mt-6 mb-2 font-bold">{cleanLine.replace('### ', '')}</h3>;
        }

        // List Items
        if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
             return <li key={idx} className="ml-6 list-disc marker:text-withered-gold text-stone-300 pl-2">{cleanLine.replace(/[*-\s]+/, '')}</li>
        }

        // Blockquotes (Takashima's Judgment)
        if (cleanLine.startsWith('>')) {
            return (
                <div key={idx} className="my-6 p-6 bg-meiji-blue border-y border-withered-gold/30 text-withered-gold italic relative">
                    <span className="absolute -top-3 left-4 bg-meiji-blue px-2 text-xs text-withered-gold/50">易聖斷語</span>
                    {cleanLine.replace('>', '')}
                </div>
            )
        }

        // Standard Paragraphs with Bold highlighting
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="text-justify opacity-90">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={pIdx} className="text-withered-gold font-bold mx-1 border-b border-withered-gold/20 pb-0.5">{part.slice(2, -2)}</span>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-meiji-blue-light border border-withered-gold/20 shadow-2xl relative overflow-hidden rounded-sm">
        
        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-[#f4e4bc] mix-blend-multiply opacity-5 pointer-events-none"></div>

        {/* Vintage Frame Borders */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-withered-gold"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-withered-gold"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-withered-gold"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-withered-gold"></div>

        {/* Seal (Stamp) */}
        <div className="absolute top-8 right-8 w-24 h-24 border-4 border-seal-red rounded-sm opacity-20 rotate-12 flex items-center justify-center pointer-events-none mix-blend-screen">
             <div className="text-seal-red font-serif font-bold text-4xl writing-vertical-rl">高島<br/>易斷</div>
        </div>

      <div className="relative z-10 p-8 md:p-12">
        <FormattedText text={content} />
      </div>
      
      <div className="py-6 border-t border-withered-gold/10 text-center bg-meiji-blue">
        <p className="text-withered-gold/40 text-xs tracking-[0.2em]">TAKASHIMA EKIDAN · EST. 1877</p>
      </div>
    </div>
  );
};

export default ResultDisplay;