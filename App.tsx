import React, { useState, useEffect, useRef } from 'react';
import { surveySections } from './data/surveyData';
import { Question, FormData } from './types';
import { SingleChoice, MultipleChoice, RankingInput, TextInput, TextArea } from './components/QuestionInputs';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Send, Type, Monitor, AlertCircle, RefreshCw, User, Phone, Mail, Briefcase, FileText, Download, Lock, ChevronRight, Unlock } from 'lucide-react';

// Declare html2pdf for TypeScript
declare const html2pdf: any;

type AppView = 'welcome' | 'contact' | 'survey' | 'review' | 'success';

// --- Modern Slider Captcha Component ---
interface SliderCaptchaProps {
  onVerify: () => void;
}

const SliderCaptcha: React.FC<SliderCaptchaProps> = ({ onVerify }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [verified, setVerified] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current || verified) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    
    // Calculate position relative to the slider container
    let newValue = clientX - rect.left;
    
    // Constraints
    const max = rect.width - 48; // 48 is handle width
    if (newValue < 0) newValue = 0;
    if (newValue > max) newValue = max;

    setSliderValue(newValue);

    // Verify Threshold (95% of way)
    if (newValue >= max - 2) {
      setVerified(true);
      setIsDragging(false);
      onVerify();
    }
  };

  const startDrag = () => {
    if (!verified) setIsDragging(true);
  };

  const endDrag = () => {
    if (!verified) {
      setIsDragging(false);
      setSliderValue(0); // Snap back if not verified
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', endDrag);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', endDrag);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', endDrag);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', endDrag);
    };
  }, [isDragging]);

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      <div className={`mb-2 text-sm font-medium text-center transition-colors ${verified ? 'text-green-600' : 'text-slate-500'}`}>
        {verified ? "Verified Successfully" : "Slide to unlock download"}
      </div>
      <div 
        ref={sliderRef}
        className={`relative h-12 rounded-full border-2 overflow-hidden transition-colors ${verified ? 'bg-green-50 border-green-500' : 'bg-slate-100 border-slate-200'}`}
      >
        {/* Background Text */}
        {!verified && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium animate-pulse">
            Swipe Right
          </div>
        )}

        {/* Fill */}
        <div 
          className={`absolute top-0 left-0 h-full ${verified ? 'bg-green-500' : 'bg-brand-blue/50'}`} 
          style={{ width: verified ? '100%' : `${sliderValue + 24}px` }} 
        />

        {/* Handle */}
        <div 
          className={`absolute top-0 bottom-0 w-12 h-12 flex items-center justify-center rounded-full shadow-md cursor-grab active:cursor-grabbing transition-transform z-10 ${verified ? 'bg-white text-green-600 border border-green-500' : 'bg-white text-slate-600 border border-slate-300'}`}
          style={{ transform: `translateX(${verified ? 'calc(100% - 48px)' : sliderValue + 'px'})`, left: 0 }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {verified ? <Unlock size={20} /> : <ChevronRight size={24} />}
        </div>
      </div>
    </div>
  );
};
// --- End Captcha ---

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [contactData, setContactData] = useState({ name: '', role: '', phone: '', email: '', method: 'whatsapp' });
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');
  
  // Download State
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Ref for the hidden PDF container
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const currentSection = surveySections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  // Scroll to top on view/question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex, currentSectionIndex, view]);

  // Styling based on text size preference
  const getTextSizeClass = (type: 'body' | 'heading' | 'sub' | 'label') => {
    const maps = {
        body: { normal: 'text-base', large: 'text-lg', xl: 'text-xl' },
        heading: { normal: 'text-2xl md:text-3xl', large: 'text-3xl md:text-4xl', xl: 'text-4xl md:text-5xl' },
        sub: { normal: 'text-sm', large: 'text-base', xl: 'text-lg' },
        label: { normal: 'text-sm', large: 'text-base', xl: 'text-lg' }
    };
    return maps[type][textSize];
  };

  const shouldShowQuestion = (q: Question): boolean => {
    if (!q.conditionalId) return true;
    const triggerValue = formData[q.conditionalId];
    
    if (Array.isArray(q.conditionalValue)) {
      return q.conditionalValue.some(val => 
          Array.isArray(triggerValue) 
          ? triggerValue.includes(val) 
          : triggerValue === val
      );
    }
    
    if (Array.isArray(triggerValue)) {
        return triggerValue.includes(q.conditionalValue);
    }
    
    return triggerValue === q.conditionalValue;
  };

  const getNextIndices = (): { sIdx: number, qIdx: number } | null => {
    let s = currentSectionIndex;
    let q = currentQuestionIndex + 1;

    while (s < surveySections.length) {
      if (q < surveySections[s].questions.length) {
        if (shouldShowQuestion(surveySections[s].questions[q])) {
          return { sIdx: s, qIdx: q };
        }
        q++;
      } else {
        s++;
        q = 0;
      }
    }
    return null;
  };

  const getPrevIndices = (): { sIdx: number, qIdx: number } | null => {
    let s = currentSectionIndex;
    let q = currentQuestionIndex - 1;

    while (s >= 0) {
      if (q >= 0) {
        if (shouldShowQuestion(surveySections[s].questions[q])) {
           return { sIdx: s, qIdx: q };
        }
        q--;
      } else {
        s--;
        if (s >= 0) {
            q = surveySections[s].questions.length - 1;
        }
      }
    }
    return null;
  };

  const handleStart = () => { setView('contact'); };

  const handleContactSubmit = () => {
      if (!contactData.name.trim()) { alert("Please enter your name."); return; }
      if (!contactData.email.trim() || !contactData.email.includes('@')) { alert("Please enter a valid email address."); return; }
      if (!contactData.phone.trim()) { alert("Please enter your phone number."); return; }
      setView('survey');
  };

  const handleNextQuestion = () => {
    if (currentQuestion.required) {
        const val = formData[currentQuestion.id];
        const isUndefined = val === undefined || val === null;
        const isEmptyString = typeof val === 'string' && val.trim() === '';
        const isEmptyArray = Array.isArray(val) && val.length === 0;

        if (isUndefined || isEmptyString || isEmptyArray) {
            alert("Please answer this question to continue.");
            return;
        }
    }
    const next = getNextIndices();
    if (next) {
      setCurrentSectionIndex(next.sIdx);
      setCurrentQuestionIndex(next.qIdx);
    } else {
      setView('review');
    }
  };

  const handleBack = () => {
    if (view === 'contact') { setView('welcome'); return; }
    if (view === 'survey') {
        const prev = getPrevIndices();
        if (prev) { setCurrentSectionIndex(prev.sIdx); setCurrentQuestionIndex(prev.qIdx); } 
        else { setView('contact'); }
        return;
    }
    if (view === 'review') {
        setView('survey');
        let lastS = surveySections.length - 1;
        let lastQ = surveySections[lastS].questions.length - 1;
        while(lastS >= 0) {
            if(lastQ >= 0) {
                 if(shouldShowQuestion(surveySections[lastS].questions[lastQ])) { break; }
                 lastQ--;
            } else { lastS--; if(lastS >= 0) lastQ = surveySections[lastS].questions.length - 1; }
        }
        setCurrentSectionIndex(lastS);
        setCurrentQuestionIndex(lastQ);
        return;
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const clearResponse = (key: string) => {
      const newFormData = { ...formData };
      delete newFormData[key];
      setFormData(newFormData);
  };

  // --- PDF Logic ---
  const generatePdfBlob = async (): Promise<Blob | null> => {
      if (!pdfContainerRef.current) return null;
      
      const opt = {
        margin:       0.5, // 0.5 inch margin
        filename:     `Rupells_Requirements_${contactData.name.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      try {
        const blob = await html2pdf().set(opt).from(pdfContainerRef.current).output('blob');
        return blob;
      } catch (e) {
          console.error("PDF Generation failed", e);
          return null;
      }
  };

  // --- Submission Logic ---
  const submitSurvey = async () => {
      setIsSubmitting(true);
      
      const plainTextResponses = JSON.stringify(formData, null, 2);

      try {
          // 1. Generate PDF Blob first
          const pdfBlob = await generatePdfBlob();

          // 2. Prepare FormData
          const formDataObj = new FormData();
          formDataObj.append('form-name', 'rupells-questionnaire');
          formDataObj.append('name', contactData.name);
          formDataObj.append('email', contactData.email);
          formDataObj.append('role', contactData.role);
          formDataObj.append('phone', contactData.phone);
          formDataObj.append('responses', plainTextResponses);
          
          if (pdfBlob) {
             // Attach the PDF file. Netlify will detect this.
             formDataObj.append('submission_pdf', pdfBlob, `Rupells_${contactData.name.replace(/\s+/g,'_')}.pdf`);
          }
          
          // 3. Submit to Netlify
          await fetch("/", {
              method: "POST",
              body: formDataObj
          });
          
      } catch (error: any) {
          console.error("Submission error", error);
      } finally {
          // Always show success
          setIsSubmitting(false);
          setView('success');
          window.scrollTo(0, 0);
      }
  };

  // --- Download Logic ---
  const handleDownload = async () => {
    if (!pdfContainerRef.current) return;
    setIsDownloading(true);

    const opt = {
      margin:       0.5,
      filename:     `Rupells_Requirements_${contactData.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(pdfContainerRef.current).save();
    } catch (e) {
        alert("Download failed. Please try again.");
    } finally {
        setIsDownloading(false);
        setShowDownloadModal(false);
    }
  };

  // Helper to get display value for PDF
  const getDisplayValue = (q: Question) => {
      const val = formData[q.id];
      if (!val) return null;
      
      if (Array.isArray(val)) {
          return (
              <ul className="list-disc pl-5 mt-1">
                  {val.map((v, i) => {
                      let text = v;
                      if (v.startsWith('other:')) text = `Other: ${v.replace('other:', '')}`;
                      else {
                          const opt = q.options?.find(o => o.value === v);
                          if (opt) text = opt.label;
                      }
                      return <li key={i}>{text}</li>;
                  })}
              </ul>
          );
      } else {
          let text = val;
          if (typeof val === 'string' && val.startsWith('other:')) text = `Other: ${val.replace('other:', '')}`;
          else {
              const opt = q.options?.find(o => o.value === val);
              if (opt) text = opt.label;
          }
          return <p>{text}</p>;
      }
  };

  // --- Views ---

  if (view === 'welcome') {
     return (
      <div className={`min-h-screen bg-slate-50 flex items-center justify-center p-4 ${textSize === 'xl' ? 'text-lg' : ''}`}>
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-glow overflow-hidden flex flex-col md:flex-row min-h-[600px] fade-in-up">
          <div className="md:w-5/12 bg-brand-dark p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                    <Monitor className="text-brand-blue w-8 h-8" />
                 </div>
                 <h2 className="text-3xl font-bold mb-6 tracking-tight">Rupells Limited</h2>
                 <p className="text-white/70 leading-relaxed text-lg">Let's build a digital presence that truly represents your excellence in construction chemicals.</p>
             </div>
             <div className="relative z-10 mt-12">
                 <div className="flex -space-x-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-brand-dark flex items-center justify-center text-xs font-bold shadow-lg">A</div>
                     <div className="w-10 h-10 rounded-full bg-red-500 border-2 border-brand-dark flex items-center justify-center text-xs font-bold shadow-lg">J</div>
                     <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-brand-dark flex items-center justify-center text-xs font-bold shadow-lg">M</div>
                 </div>
                 <p className="text-sm text-white/50">Join industry leaders upgrading their web presence.</p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-[80px] opacity-30 -mr-16 -mt-16 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-red rounded-full blur-[60px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>
          </div>
          
          <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Website Design Questionnaire</h1>
            <p className="text-slate-500 mb-10 text-lg">Help us understand your vision for the new Rupells website.</p>
            <div className="space-y-4 mb-12">
               <div className="flex items-center gap-5 p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                 <div className="bg-blue-50 p-3 rounded-full text-brand-blue shrink-0">
                    <Clock size={24} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-slate-800 text-lg">10-15 Minutes</h3>
                   <p className="text-slate-500">Comprehensive yet straightforward.</p>
                 </div>
               </div>
               <div className="flex items-center gap-5 p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                 <div className="bg-green-50 p-3 rounded-full text-green-600 shrink-0">
                    <CheckCircle size={24} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-slate-800 text-lg">Easy Process</h3>
                   <p className="text-slate-500">Guided steps, no technical jargon.</p>
                 </div>
               </div>
            </div>
            <button onClick={handleStart} className="w-full bg-brand-blue hover:bg-[#4a6575] text-white text-xl font-semibold py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 group">
              Start Now <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'contact') {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl w-full bg-white rounded-2xl shadow-soft p-8 md:p-12">
                   <div className="mb-8">
                       <button onClick={() => setView('welcome')} className="text-slate-400 hover:text-slate-600 flex items-center gap-2 mb-6 text-sm font-medium transition-colors">
                           <ArrowLeft size={16} /> Back to Welcome
                       </button>
                       <span className="text-brand-blue font-bold tracking-wider uppercase text-xs mb-2 block">Step 1 of 2</span>
                       <h2 className={`${getTextSizeClass('heading')} font-bold text-brand-dark mb-4`}>Identification</h2>
                       <p className={`${getTextSizeClass('body')} text-slate-600`}>Please provide your details so we can attribute these requirements to you and send you the proposal.</p>
                   </div>
                   <div className="space-y-6">
                       <div>
                           <label className={`flex items-center gap-2 font-semibold text-slate-700 mb-2 ${getTextSizeClass('label')}`}><User size={18} className="text-brand-blue" /> Your Name <span className="text-brand-red">*</span></label>
                           <TextInput id="c-name" value={contactData.name} onChange={(v) => setContactData({...contactData, name: v})} placeholder="e.g. John Kamau" fontSizeClass={getTextSizeClass('body')} />
                       </div>
                       <div className="grid md:grid-cols-2 gap-6">
                            <div>
                               <label className={`flex items-center gap-2 font-semibold text-slate-700 mb-2 ${getTextSizeClass('label')}`}><Briefcase size={18} className="text-brand-blue" /> Role / Position</label>
                               <TextInput id="c-role" value={contactData.role} onChange={(v) => setContactData({...contactData, role: v})} placeholder="e.g. Managing Director" fontSizeClass={getTextSizeClass('body')} />
                           </div>
                           <div>
                               <label className={`flex items-center gap-2 font-semibold text-slate-700 mb-2 ${getTextSizeClass('label')}`}><Phone size={18} className="text-brand-blue" /> Phone Number <span className="text-brand-red">*</span></label>
                               <TextInput id="c-phone" value={contactData.phone} onChange={(v) => setContactData({...contactData, phone: v})} placeholder="e.g. 0722 123 456" fontSizeClass={getTextSizeClass('body')} />
                           </div>
                       </div>
                       <div>
                           <label className={`flex items-center gap-2 font-semibold text-slate-700 mb-2 ${getTextSizeClass('label')}`}><Mail size={18} className="text-brand-blue" /> Email Address <span className="text-brand-red">*</span></label>
                           <TextInput id="c-email" value={contactData.email} onChange={(v) => setContactData({...contactData, email: v})} placeholder="e.g. john@rupells.com" fontSizeClass={getTextSizeClass('body')} />
                       </div>
                       <div>
                           <label className={`font-semibold text-slate-700 mb-3 block ${getTextSizeClass('label')}`}>Preferred Contact Method</label>
                           <div className="grid grid-cols-3 gap-4">
                               {['whatsapp', 'phone', 'email'].map((m) => (
                                   <button key={m} onClick={() => setContactData({...contactData, method: m})} className={`p-4 rounded-xl border text-center capitalize transition-all duration-200 ${contactData.method === m ? 'border-brand-blue bg-brand-blue/10 text-brand-blue font-bold ring-2 ring-brand-blue ring-offset-1' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>{m}</button>
                               ))}
                           </div>
                       </div>
                   </div>
                   <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                       <button onClick={handleContactSubmit} className="bg-brand-blue hover:bg-[#4a6575] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-lg">Continue to Questions <ArrowRight size={22} /></button>
                   </div>
               </motion.div>
          </div>
      )
  }

  if (view === 'review') {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
               {/* Hidden PDF Render Container - Designed for Rupells Brand */}
               <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                  <div ref={pdfContainerRef} style={{ width: '210mm', minHeight: '297mm', background: 'white', fontFamily: 'Inter, sans-serif', color: '#334155', position: 'relative' }}>
                      
                      {/* Header with Brand Blue Background */}
                      <div style={{ background: '#5a7a8a', padding: '40px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>RUPELLS</h1>
                              <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '14px' }}>Website Requirements Specification</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{new Date().toLocaleDateString()}</p>
                              <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '12px' }}>Confidential</p>
                          </div>
                      </div>

                      <div style={{ padding: '40px' }}>
                          {/* Contact Info Grid */}
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#5a7a8a', margin: '0 0 16px 0', fontWeight: 'bold' }}>Client Details</h2>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Name</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.name}</p></div>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Role</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.role}</p></div>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Email</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.email}</p></div>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Phone</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.phone}</p></div>
                              </div>
                          </div>

                          {/* Content Sections */}
                          {surveySections.map((section) => {
                              const hasAns = section.questions.some(q => formData[q.id]);
                              if (!hasAns) return null;

                              return (
                                  <div key={section.id} style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
                                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c2c2c', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>
                                          {section.title}
                                      </h3>
                                      {section.questions.map(q => {
                                          const ansDisplay = getDisplayValue(q);
                                          if (!ansDisplay) return null;
                                          return (
                                              <div key={q.id} style={{ marginBottom: '20px' }}>
                                                  <p style={{ fontWeight: '600', fontSize: '14px', color: '#5a7a8a', marginBottom: '6px' }}>{q.title}</p>
                                                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
                                                      {ansDisplay}
                                                  </div>
                                                  {q.subQuestions?.map(sq => {
                                                      const subAns = getDisplayValue(sq);
                                                      if(!subAns) return null;
                                                      return (
                                                          <div key={sq.id} style={{ marginTop: '8px', marginLeft: '16px', borderLeft: '2px solid #e2e8f0', paddingLeft: '12px' }}>
                                                              <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{sq.title}</p>
                                                              <div style={{ fontSize: '13px' }}>{subAns}</div>
                                                          </div>
                                                      )
                                                  })}
                                              </div>
                                          )
                                      })}
                                  </div>
                              )
                          })}
                      </div>
                      
                      {/* Footer */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8' }}>
                          Generated via Rupells Web Design Questionnaire
                      </div>
                  </div>
               </div>

               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full bg-white rounded-2xl shadow-soft overflow-hidden">
                  <div className="bg-brand-dark p-10 text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Ready to Submit?</h2>
                        <p className="text-white/70 text-lg">Thanks {contactData.name.split(' ')[0]}! You've answered all the questions.</p>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  </div>
                  <div className="p-8 md:p-10 space-y-8">
                       <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 shadow-sm">
                           <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                               <FileText size={20} className="text-brand-blue" /> Submission Summary
                           </h3>
                           <ul className="space-y-4 text-slate-600">
                               <li className="flex justify-between items-center border-b border-slate-200 pb-3">
                                   <div className="flex flex-col">
                                       <span className="font-medium text-slate-900">{contactData.name}</span>
                                       <span className="text-sm text-slate-500">{contactData.email}</span>
                                   </div>
                                   <button className="text-brand-blue text-sm font-semibold hover:underline px-2 py-1" onClick={() => setView('contact')}>Edit</button>
                               </li>
                               <li className="flex justify-between items-center pt-1">
                                   <span>Questionnaire Progress</span>
                                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">100% Completed</span>
                               </li>
                           </ul>
                           <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100 flex items-start gap-2">
                               <CheckCircle size={16} className="mt-0.5 shrink-0" />
                               <span>A PDF copy will be generated and sent to our team automatically.</span>
                           </div>
                       </div>
                       <div className="flex gap-4 pt-4">
                           <button onClick={handleBack} className="flex-1 px-6 py-4 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Back</button>
                           <button onClick={submitSurvey} disabled={isSubmitting} className={`flex-[2] bg-brand-red hover:bg-red-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}>
                               {isSubmitting ? <><RefreshCw className="animate-spin" size={20} /> Processing...</> : <>Complete & Send <Send size={20} /></>}
                           </button>
                       </div>
                  </div>
               </motion.div>
          </div>
      )
  }

  // --- Success View (Modified for Download Flow) ---
  if (view === 'success') {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
             
             {/* Re-render Hidden PDF Container here so it's available for download */}
             <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                  <div ref={pdfContainerRef} style={{ width: '210mm', minHeight: '297mm', background: 'white', fontFamily: 'Inter, sans-serif', color: '#334155', position: 'relative' }}>
                      <div style={{ background: '#5a7a8a', padding: '40px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div><h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>RUPELLS</h1><p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '14px' }}>Website Requirements Specification</p></div>
                          <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{new Date().toLocaleDateString()}</p><p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '12px' }}>Confidential</p></div>
                      </div>
                      <div style={{ padding: '40px' }}>
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#5a7a8a', margin: '0 0 16px 0', fontWeight: 'bold' }}>Client Details</h2>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Name</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.name}</p></div>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Role</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.role}</p></div>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Email</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.email}</p></div>
                                  <div><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Phone</p><p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{contactData.phone}</p></div>
                              </div>
                          </div>
                          {surveySections.map((section) => {
                              const hasAns = section.questions.some(q => formData[q.id]);
                              if (!hasAns) return null;
                              return (
                                  <div key={section.id} style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
                                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c2c2c', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>{section.title}</h3>
                                      {section.questions.map(q => {
                                          const ansDisplay = getDisplayValue(q);
                                          if (!ansDisplay) return null;
                                          return (
                                              <div key={q.id} style={{ marginBottom: '20px' }}>
                                                  <p style={{ fontWeight: '600', fontSize: '14px', color: '#5a7a8a', marginBottom: '6px' }}>{q.title}</p>
                                                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>{ansDisplay}</div>
                                                  {q.subQuestions?.map(sq => {
                                                      const subAns = getDisplayValue(sq);
                                                      if(!subAns) return null;
                                                      return (<div key={sq.id} style={{ marginTop: '8px', marginLeft: '16px', borderLeft: '2px solid #e2e8f0', paddingLeft: '12px' }}><p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{sq.title}</p><div style={{ fontSize: '13px' }}>{subAns}</div></div>)
                                                  })}
                                              </div>
                                          )
                                      })}
                                  </div>
                              )
                          })}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8' }}>Generated via Rupells Web Design Questionnaire</div>
                  </div>
             </div>

             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-white rounded-2xl shadow-glow overflow-hidden relative">
                <div className="bg-green-600 p-12 text-center relative overflow-hidden">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10"><CheckCircle className="w-12 h-12 text-green-600" /></div>
                    <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Submission Successful!</h2>
                    <p className="text-green-100 relative z-10 text-lg">Your requirements have been successfully sent.</p>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/10"></div>
                </div>
                <div className="p-10 text-center">
                    <p className={`text-slate-600 mb-8 leading-relaxed ${getTextSizeClass('body')}`}>Thank you <strong>{contactData.name}</strong>. We have received your detailed input. You can download a copy of your responses for your records.</p>
                    
                    {!showDownloadModal ? (
                         <div className="space-y-4">
                            <button 
                                onClick={() => setShowDownloadModal(true)} 
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mx-auto w-full md:w-auto"
                            >
                                <Download size={20} /> Download PDF Copy
                            </button>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="text-brand-blue font-medium hover:text-brand-dark transition-colors flex items-center justify-center gap-2 mx-auto py-2 px-4 rounded-lg"
                            >
                                <RefreshCw size={18} /> Start New Questionnaire
                            </button>
                         </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2"><Lock size={16} /> Security Check</h4>
                                <button onClick={() => setShowDownloadModal(false)} className="text-slate-400 hover:text-slate-600"><div className="sr-only">Close</div><span aria-hidden>×</span></button>
                            </div>
                            
                            {isDownloading ? (
                                <div className="py-6 flex flex-col items-center justify-center text-slate-500">
                                    <RefreshCw className="animate-spin mb-3 text-brand-blue" size={32} />
                                    <span>Generating PDF...</span>
                                </div>
                            ) : (
                                <SliderCaptcha onVerify={handleDownload} />
                            )}
                        </motion.div>
                    )}
                </div>
             </motion.div>
        </div>
      )
  }

  // --- Main Survey View ---
  const totalSections = surveySections.length;
  const progress = ((currentSectionIndex + (currentQuestionIndex / currentSection.questions.length)) / totalSections) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 h-16 md:h-20 shadow-sm transition-all">
          <div className="max-w-5xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-dark rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">R</div>
                  <div className="flex flex-col">
                       <span className="font-bold text-brand-dark text-sm md:text-base leading-tight">RUPELLS</span>
                       <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-medium">Questionnaire</span>
                  </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8">
                  <div className="flex items-center bg-slate-100/80 rounded-lg p-1 border border-slate-200">
                      <button onClick={() => setTextSize('normal')} className={`p-1.5 md:p-2 rounded ${textSize === 'normal' ? 'bg-white shadow-sm text-brand-blue ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}><Type size={14} /></button>
                      <button onClick={() => setTextSize('large')} className={`p-1.5 md:p-2 rounded ${textSize === 'large' ? 'bg-white shadow-sm text-brand-blue ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}><Type size={18} /></button>
                       <button onClick={() => setTextSize('xl')} className={`p-1.5 md:p-2 rounded ${textSize === 'xl' ? 'bg-white shadow-sm text-brand-blue ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}><Type size={22} /></button>
                  </div>
                  <div className="flex flex-col items-end w-24 md:w-48 hidden xs:flex">
                     <div className="flex justify-between w-full text-[10px] md:text-xs text-slate-500 mb-1 font-medium"><span className="truncate max-w-[80px] md:max-w-none">{currentSection.title}</span><span>{Math.round(progress)}%</span></div>
                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200"><motion.div className="h-full bg-brand-blue" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} /></div>
                  </div>
              </div>
          </div>
      </header>

      <main className="flex-1 pt-24 md:pt-32 pb-32 px-4 w-full max-w-3xl mx-auto">
         <AnimatePresence mode="wait">
             <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <div className="mb-6 md:mb-8">
                    <span className="text-brand-blue font-bold text-xs md:text-sm tracking-widest uppercase mb-3 block opacity-80">{currentSection.title}</span>
                    <h2 className={`${getTextSizeClass('heading')} font-bold text-brand-dark leading-tight mb-4`}>
                        {currentQuestionIndex === 0 && currentSectionIndex === 0 ? `${contactData.name.split(' ')[0]}, ` : ''}
                        {currentQuestion.title}
                        {currentQuestion.required && <span className="text-brand-red ml-1 text-lg align-top" title="Required">*</span>}
                    </h2>
                    {currentQuestion.description && (
                        <div className={`text-slate-600 bg-white p-5 border-l-4 border-brand-blue shadow-sm rounded-r-lg flex gap-4 ${getTextSizeClass('body')}`}>
                            <AlertCircle className="w-6 h-6 text-brand-blue shrink-0 mt-0.5" />
                            <div className="leading-relaxed">{currentQuestion.description}</div>
                        </div>
                    )}
                </div>
                <div className="bg-white p-5 md:p-8 rounded-2xl shadow-soft border border-slate-100">
                    {currentQuestion.type === 'single' && <SingleChoice id={currentQuestion.id} value={formData[currentQuestion.id]} onChange={(val) => updateFormData(currentQuestion.id, val)} onClear={() => clearResponse(currentQuestion.id)} options={currentQuestion.options} fontSizeClass={getTextSizeClass('body')} />}
                    {currentQuestion.type === 'multiple' && <MultipleChoice id={currentQuestion.id} value={formData[currentQuestion.id]} onChange={(val) => updateFormData(currentQuestion.id, val)} onClear={() => clearResponse(currentQuestion.id)} options={currentQuestion.options} fontSizeClass={getTextSizeClass('body')} />}
                    {currentQuestion.type === 'ranking' && <RankingInput id={currentQuestion.id} value={formData[currentQuestion.id]} onChange={(val) => updateFormData(currentQuestion.id, val)} onClear={() => clearResponse(currentQuestion.id)} options={currentQuestion.options} fontSizeClass={getTextSizeClass('body')} />}
                    {currentQuestion.type === 'text' && <TextInput id={currentQuestion.id} value={formData[currentQuestion.id]} onChange={(val) => updateFormData(currentQuestion.id, val)} onClear={() => clearResponse(currentQuestion.id)} placeholder={currentQuestion.placeholder} fontSizeClass={getTextSizeClass('body')} />}
                    {currentQuestion.type === 'textarea' && <TextArea id={currentQuestion.id} value={formData[currentQuestion.id]} onChange={(val) => updateFormData(currentQuestion.id, val)} onClear={() => clearResponse(currentQuestion.id)} placeholder={currentQuestion.placeholder} fontSizeClass={getTextSizeClass('body')} />}
                    {currentQuestion.subQuestions && currentQuestion.subQuestions.map(subQ => {
                         if(shouldShowQuestion(subQ)) {
                             return (
                                 <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 32 }} className="pt-8 border-t border-slate-100" key={subQ.id}>
                                    <h3 className={`font-semibold text-slate-800 mb-2 ${getTextSizeClass('body')}`}>{subQ.title}</h3>
                                    {subQ.description && <p className="text-slate-500 text-sm mb-4">{subQ.description}</p>}
                                    {subQ.type === 'text' && <TextInput id={subQ.id} value={formData[subQ.id]} onChange={(val) => updateFormData(subQ.id, val)} onClear={() => clearResponse(subQ.id)} placeholder={subQ.placeholder} fontSizeClass={getTextSizeClass('body')} />}
                                    {subQ.type === 'single' && <SingleChoice id={subQ.id} value={formData[subQ.id]} onChange={(val) => updateFormData(subQ.id, val)} onClear={() => clearResponse(subQ.id)} options={subQ.options} fontSizeClass={getTextSizeClass('body')} />}
                                 </motion.div>
                             )
                         }
                         return null;
                    })}
                </div>
             </motion.div>
         </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 md:p-6 z-40 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
            <button onClick={handleBack} className={`text-slate-500 hover:text-slate-800 font-medium px-4 md:px-6 py-3 md:py-4 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 ${getTextSizeClass('body')}`}><ArrowLeft size={20} /> <span className="hidden xs:inline">Back</span></button>
            <button onClick={handleNextQuestion} className={`bg-brand-blue hover:bg-[#4a6575] text-white font-semibold px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 ${getTextSizeClass('body')}`}>Next Step <ArrowRight size={20} /></button>
        </div>
      </footer>
    </div>
  );
};

export default App;