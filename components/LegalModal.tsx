import React from 'react';

type LegalModalType = 'terms' | 'privacy';

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

const TermsContent = () => (
  <div className="space-y-6 text-stone-300 font-serif text-sm md:text-base">
    <h3 className="text-withered-gold font-bold text-lg">1. 服務性質聲明 (Nature of Service)</h3>
    <p>
      本網站提供的所有內容、運勢分析及報告僅供休閒娛樂與民俗文化探討之用。 All content and reports provided on this site are for entertainment purposes only.
    </p>
    <p>
      “靈機・八字”与“高島易斷”算法是基於中國傳統命理學與《周易》哲學的學術模型推演。我們致力於通過 AI 技術還原古籍理論，但不保證預測結果的絕對準確性、完整性或對未來事件的適用性。命運掌握在您自己手中，本報告僅作為一種心理諮詢或文化體驗供您參考。
    </p>

    <h3 className="text-withered-gold font-bold text-lg">2. 非專業建議聲明 (No Professional Advice)</h3>
    <p>
      本網站不提供任何形式的醫療、法律、投資或財務建議。 This site does not provide medical, legal, investment, or financial advice.
    </p>
    <ul className="list-disc pl-5 space-y-2">
      <li>關於健康：如果您有身心健康方面的問題，請務必諮詢專業醫生。切勿因本網站的運勢分析而忽視或延誤就醫。</li>
      <li>關於財務：報告中關於“財運”或“投資”的解讀僅為易學卦象的隱喻，絕不構成具體的投資指導。請您根據自身判斷進行財務決策，本網站對您的任何盈虧概不負責。</li>
    </ul>

    <h3 className="text-withered-gold font-bold text-lg">3. 退款政策 (Refund Policy)</h3>
    <p>
      虛擬數位商品，恕不退款。 Digital goods are non-refundable.
    </p>
    <p>
      由於本服務屬於數位內容（Digital Content），一旦您輸入信息並點擊生成，AI 算力成本即已消耗，且報告內容已即時交付（或發送至您的郵箱）。因此，除系統故障導致無法生成報告外，我們不接受以“算得不準”、“不滿意結果”等主觀理由提出的退款申請。購買即代表您同意此條款。
    </p>

    <h3 className="text-withered-gold font-bold text-lg">4. 免責條款 (Limitation of Liability)</h3>
    <p>
      在法律允許的最大範圍內，本網站及其運營團隊不對因使用本服務而產生的任何直接、間接、附帶或後果性的損害負責。用戶應自行承擔使用本服務的所有風險。
    </p>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-6 text-stone-300 font-serif text-sm md:text-base">
    <h3 className="text-withered-gold font-bold text-lg">1. 信息收集 (Information Collection)</h3>
    <p>為了向您提供準確的八字與卦象分析，我們需要收集您的以下個人信息：</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>出生日期與時間 (Date and Time of Birth)</li>
      <li>出生地點 (Place of Birth) - 僅用於校準真太陽時</li>
      <li>性別 (Gender)</li>
      <li>電子郵件地址 (Email Address) - 僅用於發送報告</li>
    </ul>
    <p className="mt-2 text-withered-gold/80 italic border-l-2 border-withered-gold pl-3">
      我们承諾：我们不會收集您的信用卡號碼或其他敏感支付信息。 所有支付流程均通過第三方加密支付網關（如 Stripe/PayPal）安全處理。
    </p>

    <h3 className="text-withered-gold font-bold text-lg">2. 數據使用與AI處理 (Data Usage & AI Processing)</h3>
    <p>
      您輸入的生辰數據將被發送至我們安全的後端服務器，並通過 Google Gemini API 進行自然語言處理以生成報告。
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>數據最小化：我們僅將生成報告所必需的參數發送給 AI 模型。</li>
      <li>不作為訓練數據：根據我們與 AI 服務商的協議，您的個人數據不會被用於訓練公共 AI 模型。</li>
    </ul>

    <h3 className="text-withered-gold font-bold text-lg">3. 數據存儲與保護 (Data Storage & Security)</h3>
    <p>
      您的測算報告將在我們的服務器上保留 30天，以便您隨時下載或查閱。30天後，系統將自動刪除或匿名化處理您的詳細數據。我們採取嚴格的技術措施防止數據洩露，絕不會將您的個人信息出售、出租或分享給任何第三方營銷機構。
    </p>

    <h3 className="text-withered-gold font-bold text-lg">4. Cookie 的使用 (Use of Cookies)</h3>
    <p>
      本網站使用 Cookies 以優化您的瀏覽體驗（例如記住您的語言偏好）。繼續使用本網站即表示您同意我們使用 Cookies。
    </p>
  </div>
);

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative z-10 bg-[#0a1f35] border border-withered-gold/50 rounded-sm w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-withered-gold/20 bg-[#051829]">
          <h2 className="text-2xl font-serif text-withered-gold font-bold tracking-widest">
            {type === 'terms' ? '免責聲明與服務條款' : '隱私權政策'}
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-withered-gold transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide bg-[#0a1f35]">
          {type === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-withered-gold/20 bg-[#051829] text-center">
          <button 
            onClick={onClose}
            className="px-10 py-3 border border-withered-gold text-withered-gold hover:bg-withered-gold hover:text-[#051829] transition-all font-serif font-bold tracking-widest uppercase text-sm"
          >
            我已瞭解 | I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;