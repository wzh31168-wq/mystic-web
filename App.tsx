import React, { useState } from 'react';
import { UserData, Gender, PlanLevel } from './types';
import { generateFortune } from './services/geminiService';
import LoadingRitual from './components/LoadingRitual';
import ResultDisplay from './components/ResultDisplay';
import PricingPlans from './components/PricingPlans';
import LegalModal from './components/LegalModal';

enum AppStep {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  PREVIEW = 'PREVIEW', 
  PAYMENT = 'PAYMENT',
  FULL_RESULT = 'FULL_RESULT'
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    gender: Gender.MALE,
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    customQuestion: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<PlanLevel>(PlanLevel.STANDARD);
  const [fortuneText, setFortuneText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Legal Modal State
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const startCalculation = async () => {
    if (!userData.name || !userData.birthDate || !userData.birthTime) {
      alert("請填寫完整信息以獲取準確批命");
      return;
    }

    setStep(AppStep.LOADING);
    setError(null);

    // Initial Free/Preview Calculation
    try {
      const result = await generateFortune(userData, PlanLevel.FREE);
      setFortuneText(result);
      setStep(AppStep.PREVIEW);
    } catch (err) {
      console.error(err);
      setError("連線大師失敗，請檢查網絡設置。");
      setStep(AppStep.INPUT);
    }
  };

  const handlePlanSelection = (plan: PlanLevel) => {
    setSelectedPlan(plan);
    if (plan === PlanLevel.FREE) {
        alert("您已在查看試讀版内容。");
    } else {
        setStep(AppStep.PAYMENT);
    }
  };

  const processPayment = async () => {
    if (!agreedToTerms) return;
    
    setStep(AppStep.LOADING);
    try {
      const result = await generateFortune(userData, selectedPlan);
      setFortuneText(result);
      setStep(AppStep.FULL_RESULT);
    } catch (err) {
       console.error(err);
      setError("解鎖詳細運程失敗，請重試。");
      setStep(AppStep.PAYMENT);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-serif">
      
      {/* Background with Noise and Gradient */}
      <div className="noise-overlay"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-[#051829] to-[#000000] z-0"></div>

      {/* Header */}
      <header className="relative z-10 py-10 text-center">
        <div className="inline-block border-y-2 border-withered-gold py-2 px-8 mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-withered-gold tracking-[0.3em] font-serif">高島易斷</h1>
        </div>
        <p className="text-sm text-stone-500 tracking-[0.4em] uppercase font-bold">Takashima Ekidan · The Imperial Divination</p>
      </header>

      <main className="relative z-10 container mx-auto px-4 pb-20">
        
        {step === AppStep.INPUT && (
          <div className="max-w-md mx-auto bg-meiji-blue-light/80 backdrop-blur-sm p-10 rounded-sm border border-withered-gold/30 shadow-2xl animate-fade-in">
            <h2 className="text-2xl text-center mb-10 text-withered-gold font-bold tracking-widest border-b border-withered-gold/20 pb-4">
                八字排盤・易聖神算
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-withered-gold text-xs mb-2 tracking-widest uppercase">緣主姓名</label>
                <input 
                  type="text" name="name" value={userData.name} onChange={handleInputChange}
                  className="w-full bg-[#051829] border-b border-stone-600 focus:border-withered-gold outline-none p-3 text-stone-200 text-center font-serif text-lg transition-colors placeholder-stone-700"
                  placeholder="請輸入姓名"
                />
              </div>

              <div>
                <label className="block text-withered-gold text-xs mb-2 tracking-widest uppercase">陰陽乾坤</label>
                <div className="flex space-x-4">
                  <label className={`flex-1 p-3 text-center border cursor-pointer transition-all ${userData.gender === Gender.MALE ? 'border-withered-gold bg-[#051829] text-withered-gold' : 'border-stone-700 text-stone-600'}`}>
                    <input type="radio" name="gender" value={Gender.MALE} checked={userData.gender === Gender.MALE} onChange={handleInputChange} className="hidden" />
                    乾造 (男)
                  </label>
                  <label className={`flex-1 p-3 text-center border cursor-pointer transition-all ${userData.gender === Gender.FEMALE ? 'border-withered-gold bg-[#051829] text-withered-gold' : 'border-stone-700 text-stone-600'}`}>
                    <input type="radio" name="gender" value={Gender.FEMALE} checked={userData.gender === Gender.FEMALE} onChange={handleInputChange} className="hidden" />
                    坤造 (女)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-withered-gold text-xs mb-2 tracking-widest uppercase">陽曆生辰</label>
                  <input 
                    type="date" name="birthDate" value={userData.birthDate} onChange={handleInputChange}
                    className="w-full bg-[#051829] border-b border-stone-600 focus:border-withered-gold outline-none p-3 text-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-withered-gold text-xs mb-2 tracking-widest uppercase">時辰</label>
                  <input 
                    type="time" name="birthTime" value={userData.birthTime} onChange={handleInputChange}
                    className="w-full bg-[#051829] border-b border-stone-600 focus:border-withered-gold outline-none p-3 text-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-withered-gold text-xs mb-2 tracking-widest uppercase">出生地 (校準真太陽時)</label>
                <input 
                  type="text" name="birthPlace" value={userData.birthPlace} onChange={handleInputChange}
                  className="w-full bg-[#051829] border-b border-stone-600 focus:border-withered-gold outline-none p-3 text-stone-300 text-center"
                  placeholder="例如：中國上海、台灣台北"
                />
              </div>

              <button 
                onClick={startCalculation}
                className="w-full bg-withered-gold hover:bg-[#d4b06a] text-meiji-blue font-bold py-4 mt-6 transition-all tracking-[0.5em] text-lg shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]"
              >
                易聖推演
              </button>
            </div>
            
            {error && <p className="text-red-800 bg-red-100/10 p-2 text-center mt-4 text-xs">{error}</p>}
          </div>
        )}

        {step === AppStep.LOADING && (
          <LoadingRitual />
        )}

        {step === AppStep.PREVIEW && (
          <div className="animate-fade-in space-y-12">
            <div className="text-center">
               <span className="text-withered-gold/60 text-xs tracking-[0.3em] border-b border-withered-gold/30 pb-1">初筮結果・僅供試讀</span>
            </div>
            
            <ResultDisplay content={fortuneText} />
            
            {/* The Hook Section */}
            <div className="bg-[#0f233a] border border-withered-gold/30 relative overflow-hidden max-w-5xl mx-auto rounded-sm">
               {/* Blurred Text Effect to simulate hidden content */}
               <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f233a] to-transparent z-10"></div>
               <div className="p-8 opacity-30 select-none blur-[2px] pointer-events-none">
                  <h3 className="text-2xl text-withered-gold mb-4">四、一生財運與商略</h3>
                  <p className="text-stone-400 mb-4">根據高島易斷之法，閣下財庫坐落於...</p>
                  <p className="text-stone-400">未來十年大運走勢顯示，2026年將會是...</p>
                  <p className="text-stone-400">本命卦象顯示，事業發展最忌諱...</p>
               </div>

               {/* Call to Action */}
               <div className="relative z-20 -mt-20 pb-12 text-center px-4">
                   <div className="inline-block bg-[#051829]/90 border border-withered-gold p-8 shadow-2xl backdrop-blur-md max-w-3xl">
                       <h3 className="text-2xl font-serif text-withered-gold mb-4 font-bold">天機不可洩露？</h3>
                       <p className="text-stone-300 mb-8 leading-relaxed">
                         緣主，您的【本命卦】已定，其中蘊藏了未來三十年的商戰成敗與財運玄機。
                         <br/>高島易斷以“謀略”著稱，這份報告不僅是算命，更是您的<span className="text-white font-bold mx-1">人生戰略書</span>。
                       </p>
                       
                       <button 
                         onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                         className="animate-bounce bg-withered-gold text-meiji-blue px-8 py-3 font-bold tracking-widest hover:bg-white transition-colors"
                       >
                         立即解封全卷
                       </button>
                   </div>
               </div>
               
               <div id="pricing">
                   <PricingPlans 
                      onSelectPlan={handlePlanSelection} 
                      selectedPlan={selectedPlan}
                   />
               </div>
            </div>
          </div>
        )}

        {step === AppStep.PAYMENT && (
            <div className="max-w-xl mx-auto bg-[#0a1f35] p-8 md:p-12 border border-withered-gold/40 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-withered-gold"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-withered-gold"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-withered-gold"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-withered-gold"></div>

                <h3 className="text-2xl font-serif text-withered-gold mb-8 text-center tracking-widest">潤金支付</h3>
                
                <div className="bg-[#051829] p-6 mb-8 border border-white/5 flex justify-between items-center">
                    <div>
                        <div className="text-stone-400 text-sm mb-1">已選方案</div>
                        <div className="text-xl font-bold text-stone-200">{selectedPlan === PlanLevel.STANDARD ? '高島詳批' : '易聖親算'}</div>
                    </div>
                    <div className="text-2xl font-bold text-withered-gold font-sans">
                        {selectedPlan === PlanLevel.STANDARD ? '$16.80' : '$28.80'}
                    </div>
                </div>

                {selectedPlan === PlanLevel.PREMIUM && (
                     <div className="mb-8">
                        <label className="block text-withered-gold text-sm mb-3 tracking-widest">
                            <span className="mr-2">❖</span>單事問占 (限一問)
                        </label>
                        <textarea 
                            value={userData.customQuestion || ''} 
                            onChange={(e) => setUserData(prev => ({...prev, customQuestion: e.target.value}))}
                            className="w-full h-24 bg-[#051829] border border-stone-600 focus:border-withered-gold outline-none p-4 text-stone-300 font-serif resize-none"
                            placeholder="例如：我目前正考慮投資一個餐飲項目，合夥人屬虎，此項目能否盈利？"
                        />
                    </div>
                )}
                
                {/* Terms and Privacy Checkbox */}
                <div className="mb-6">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                        <div className="relative flex items-center pt-1">
                            <input 
                                type="checkbox" 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-stone-500 checked:border-withered-gold checked:bg-withered-gold transition-all"
                            />
                            {/* Checkmark Icon */}
                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#051829] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-stone-400 text-sm leading-tight group-hover:text-stone-300">
                            我已閱讀並同意
                            <button onClick={(e) => {e.preventDefault(); setLegalModalType('terms')}} className="text-withered-gold hover:underline mx-1">《服務條款》</button>
                            與
                            <button onClick={(e) => {e.preventDefault(); setLegalModalType('privacy')}} className="text-withered-gold hover:underline mx-1">《隱私政策》</button>
                            ，並瞭解本服務僅供娛樂，數位商品售出不退。
                        </span>
                    </label>
                </div>

                <div className="space-y-4">
                    {/* Lemon Squeezy Style Button */}
                    <button 
                        onClick={processPayment}
                        disabled={!agreedToTerms}
                        className={`w-full py-4 font-bold flex items-center justify-center space-x-2 transition-colors rounded-sm
                            ${agreedToTerms 
                                ? 'bg-[#7047EB] hover:bg-[#6037DB] text-white cursor-pointer' 
                                : 'bg-stone-700 text-stone-500 cursor-not-allowed opacity-50'}`}
                    >
                         <span>Pay with Lemon Squeezy</span>
                    </button>
                    
                    {/* Stripe Style */}
                    <button 
                        onClick={processPayment}
                        disabled={!agreedToTerms}
                        className={`w-full py-4 font-bold flex items-center justify-center space-x-2 transition-colors rounded-sm
                            ${agreedToTerms 
                                ? 'bg-[#333] hover:bg-[#444] text-white cursor-pointer' 
                                : 'bg-stone-700 text-stone-500 cursor-not-allowed opacity-50'}`}
                    >
                         <span>Credit Card (Stripe)</span>
                    </button>

                    <p className="text-[10px] text-stone-600 text-center mt-6">
                        *此為演示環境，點擊按鈕將直接模擬支付成功。
                    </p>
                    <button 
                        onClick={() => setStep(AppStep.PREVIEW)}
                        className="w-full text-stone-500 text-sm mt-4 hover:text-withered-gold"
                    >
                        返回重選
                    </button>
                </div>
            </div>
        )}

        {step === AppStep.FULL_RESULT && (
             <div className="animate-fade-in">
                  <div className="flex justify-between items-center max-w-4xl mx-auto mb-6 px-4">
                      <h2 className="text-2xl font-serif text-withered-gold font-bold">高島易斷・運程書</h2>
                      <button 
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 text-stone-400 hover:text-withered-gold border border-stone-600 hover:border-withered-gold px-4 py-2 text-sm transition-all"
                      >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          <span>下載 PDF 家傳秘卷</span>
                      </button>
                  </div>
                 <ResultDisplay content={fortuneText} />
             </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-stone-600 text-xs border-t border-white/5 bg-[#030e18]">
        <p className="tracking-widest mb-4">&copy; 1877-2025 高島易斷總本家 (Takashima Ekidan). All rights reserved.</p>
        
        {/* Footer Legal Links */}
        <div className="flex justify-center space-x-6 mb-4 font-serif text-stone-500">
             <button onClick={() => setLegalModalType('terms')} className="hover:text-withered-gold transition-colors">免責聲明與服務條款</button>
             <span className="text-stone-700">|</span>
             <button onClick={() => setLegalModalType('privacy')} className="hover:text-withered-gold transition-colors">隱私權政策</button>
        </div>
        
        <p className="opacity-50">本服務基於明治時代易聖高島嘉右衛門之理論進行AI推演。命理分析僅供娛樂與文化參考，請理性看待。</p>
      </footer>

      {/* Legal Modal Overlay */}
      {legalModalType && (
          <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      )}
    </div>
  );
};

export default App;