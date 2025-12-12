import React from 'react';
import { PlanLevel, PricingTier } from '../types';
import { PRICING_TIERS } from '../constants';

interface PricingPlansProps {
  onSelectPlan: (plan: PlanLevel) => void;
  selectedPlan: PlanLevel | null;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ onSelectPlan, selectedPlan }) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-withered-gold tracking-[0.2em] mb-4 font-bold">
            解封易聖親批
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-withered-gold to-transparent mx-auto mb-6"></div>
        <p className="text-stone-400 font-serif text-lg">
            商場如戰場，運勢即兵法。<br className="md:hidden"/>請選擇您的決策顧問。
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {PRICING_TIERS.map((tier) => {
          const isSelected = selectedPlan === tier.id;
          const isRecommended = tier.recommended;
          const isPremium = tier.id === PlanLevel.PREMIUM;
          const isStandard = tier.id === PlanLevel.STANDARD;

          return (
            <div 
              key={tier.id}
              onClick={() => onSelectPlan(tier.id)}
              className={`
                relative flex flex-col p-1 rounded-sm cursor-pointer transition-all duration-500 group
                ${isSelected 
                  ? 'transform scale-105 shadow-[0_20px_60px_rgba(197,160,89,0.15)] z-20' 
                  : 'hover:transform hover:scale-102 hover:shadow-2xl opacity-90 hover:opacity-100 z-10'}
              `}
            >
              {/* Card Container */}
              <div className={`
                flex-1 flex flex-col p-8 border h-full relative overflow-hidden transition-colors duration-300
                ${isSelected 
                   ? 'bg-[#0e2a45] border-withered-gold' 
                   : 'bg-[#0a1f35] border-white/10 hover:border-withered-gold/50'}
              `}>
                
                {/* Background Noise */}
                <div className="absolute inset-0 bg-noise opacity-10"></div>
                
                {/* Recommended Banner */}
                {isRecommended && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-withered-gold to-transparent shadow-[0_0_15px_#c5a059]"></div>
                )}
                
                <div className="text-center mb-8 relative z-10">
                  <h3 className={`text-2xl font-bold font-serif mb-2 tracking-widest ${isSelected ? 'text-withered-gold' : 'text-stone-300'}`}>
                    {tier.name}
                  </h3>
                  <div className="flex justify-center items-baseline space-x-1">
                      <span className={`text-4xl font-bold font-sans ${isSelected ? 'text-white' : 'text-stone-400'}`}>
                        {tier.price}
                      </span>
                  </div>
                  {isPremium && <div className="text-xs text-withered-gold mt-2 tracking-wider border border-withered-gold/30 rounded-full px-2 py-1 inline-block">包含 VIP 單事問占</div>}
                  {isStandard && <div className="text-xs text-withered-gold/80 mt-2 tracking-wider">最受歡迎</div>}
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

                <ul className="flex-1 space-y-5 mb-10 relative z-10 pl-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm md:text-base group-hover:pl-1 transition-all">
                      <span className={`mr-3 mt-1 ${isSelected ? 'text-withered-gold' : 'text-stone-600 group-hover:text-withered-gold'}`}>❖</span>
                      <span className={`${isSelected ? 'text-stone-200' : 'text-stone-400'} font-serif tracking-wide`}>
                          {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`
                    w-full py-4 px-4 text-sm tracking-[0.2em] font-serif border transition-all relative z-10 uppercase font-bold
                    ${isSelected 
                      ? 'bg-withered-gold text-meiji-blue border-withered-gold hover:bg-[#d4b06a] shadow-[0_0_20px_rgba(197,160,89,0.3)]' 
                      : 'bg-transparent text-stone-400 border-stone-700 group-hover:border-stone-500 group-hover:text-stone-200'}
                  `}
                >
                  {isSelected ? '確認選擇' : '選擇此卷'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Trust Badge */}
      <div className="text-center mt-12 opacity-60">
         <div className="flex justify-center items-center space-x-6 text-stone-500 text-xs tracking-widest uppercase">
            <span>Secure Payment</span>
            <span>•</span>
            <span>Instant Access</span>
            <span>•</span>
            <span>Satisfaction Guarantee</span>
         </div>
      </div>
    </div>
  );
};

export default PricingPlans;