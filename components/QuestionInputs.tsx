import React, { useState } from 'react';
import { Option } from '../types';
import { Check, ArrowUp, ArrowDown, X, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface BaseInputProps {
  id: string;
  value: any;
  onChange: (value: any) => void;
  options?: Option[];
  placeholder?: string;
  fontSizeClass?: string;
  onClear?: () => void;
}

export const TextInput: React.FC<BaseInputProps> = ({ value, onChange, placeholder, fontSizeClass, onClear }) => (
  <div className="relative">
    <input
      type="text"
      className={`w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all bg-white shadow-sm text-slate-700 ${fontSizeClass || 'text-base'}`}
      placeholder={placeholder || "Type your answer here..."}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && onClear && (
        <button 
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-1"
            title="Clear"
        >
            <X size={20} />
        </button>
    )}
  </div>
);

export const TextArea: React.FC<BaseInputProps> = ({ value, onChange, placeholder, fontSizeClass, onClear }) => (
  <div className="relative">
    <textarea
      className={`w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all min-h-[140px] bg-white shadow-sm text-slate-700 ${fontSizeClass || 'text-base'}`}
      placeholder={placeholder || "Type your answer here..."}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
     {value && onClear && (
        <button 
            onClick={onClear}
            className="absolute right-3 top-3 text-slate-400 hover:text-red-500 p-1 bg-white rounded-full shadow-sm border border-slate-100"
            title="Clear"
        >
            <X size={18} />
        </button>
    )}
  </div>
);

export const SingleChoice: React.FC<BaseInputProps> = ({ options, value, onChange, fontSizeClass, onClear }) => {
  const [otherValue, setOtherValue] = useState('');

  return (
    <div className="space-y-3">
        <div className="flex justify-end">
             {value && onClear && (
                <button 
                    onClick={() => { setOtherValue(''); onClear(); }} 
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1"
                >
                    <RefreshCw size={12} /> Clear selection
                </button>
            )}
        </div>
      {options?.map((opt) => {
        const isSelected = value === opt.value || (opt.isOther && value?.startsWith('other:'));
        return (
          <div key={opt.value}>
            <motion.div
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => {
                 if(!opt.isOther) {
                     onChange(opt.value);
                     setOtherValue('');
                 } else {
                     onChange(`other:${otherValue}`);
                 }
              }}
              className={`cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all ${
                isSelected
                  ? 'border-brand-blue bg-brand-blue/5 shadow-md'
                  : 'border-slate-200 bg-white hover:border-brand-blue/40 hover:bg-slate-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                isSelected ? 'border-brand-blue bg-brand-blue' : 'border-slate-300'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <span className={`flex-1 font-medium ${fontSizeClass || 'text-base'} ${isSelected ? 'text-brand-blue' : 'text-slate-700'}`}>
                {opt.label}
              </span>
            </motion.div>
            
            {opt.isOther && isSelected && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 ml-10"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Please specify..."
                  className={`w-full p-2 border-b-2 border-brand-blue outline-none bg-transparent text-slate-700 ${fontSizeClass || 'text-base'}`}
                  value={otherValue}
                  onChange={(e) => {
                    setOtherValue(e.target.value);
                    onChange(`other:${e.target.value}`);
                  }}
                />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const MultipleChoice: React.FC<BaseInputProps> = ({ options, value, onChange, fontSizeClass, onClear }) => {
  // value is array of strings
  const currentValues = Array.isArray(value) ? value : [];
  const [otherText, setOtherText] = useState('');

  const toggleValue = (val: string, isOtherItem: boolean) => {
    let newValues = [...currentValues];
    
    // Handle 'Other' special case logic
    if (isOtherItem) {
        // If we represent other as "other:text"
        const existingOther = newValues.find(v => v.startsWith('other:'));
        if (existingOther) {
             newValues = newValues.filter(v => !v.startsWith('other:'));
        } else {
             newValues.push(`other:${otherText}`);
        }
    } else {
        if (newValues.includes(val)) {
            newValues = newValues.filter(v => v !== val);
        } else {
            newValues.push(val);
        }
    }
    onChange(newValues);
  };

  const isOtherSelected = currentValues.some((v: string) => v.startsWith('other:'));

  return (
    <div className="space-y-3">
       <div className="flex justify-end">
             {currentValues.length > 0 && onClear && (
                <button 
                    onClick={onClear} 
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1"
                >
                    <RefreshCw size={12} /> Clear all
                </button>
            )}
        </div>
      {options?.map((opt) => {
        const isSelected = opt.isOther 
            ? isOtherSelected 
            : currentValues.includes(opt.value);

        return (
          <div key={opt.value}>
             <motion.div
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => toggleValue(opt.value, !!opt.isOther)}
              className={`cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all ${
                isSelected
                  ? 'border-brand-blue bg-brand-blue/5 shadow-md'
                  : 'border-slate-200 bg-white hover:border-brand-blue/40 hover:bg-slate-50'
              }`}
            >
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                isSelected ? 'border-brand-blue bg-brand-blue' : 'border-slate-300'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className={`flex-1 font-medium ${fontSizeClass || 'text-base'} ${isSelected ? 'text-brand-blue' : 'text-slate-700'}`}>
                {opt.label}
              </span>
            </motion.div>
             {opt.isOther && isSelected && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 ml-10"
              >
                <input
                  type="text"
                  placeholder="Please specify..."
                  className={`w-full p-2 border-b-2 border-brand-blue outline-none bg-transparent text-slate-700 ${fontSizeClass || 'text-base'}`}
                  value={otherText}
                  onChange={(e) => {
                      setOtherText(e.target.value);
                      // Update the "other:..." value in the array
                      const newVals = currentValues.filter((v: string) => !v.startsWith('other:'));
                      newVals.push(`other:${e.target.value}`);
                      onChange(newVals);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const RankingInput: React.FC<BaseInputProps> = ({ options, value, onChange, fontSizeClass, onClear }) => {
  // Value is an ordered array of strings
  const rankedItems: string[] = Array.isArray(value) ? value : [];
  const availableOptions = options?.filter(o => !rankedItems.includes(o.value)) || [];

  const handleSelect = (val: string) => {
    onChange([...rankedItems, val]);
  };

  const handleRemove = (val: string) => {
    onChange(rankedItems.filter(item => item !== val));
  };

  const moveUp = (index: number) => {
      if (index === 0) return;
      const newItems = [...rankedItems];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      onChange(newItems);
  };

  const moveDown = (index: number) => {
      if (index === rankedItems.length - 1) return;
      const newItems = [...rankedItems];
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      onChange(newItems);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
         <div className="flex justify-between items-center mb-3">
             <h4 className="text-sm font-bold text-slate-500 uppercase">Your Ranking (Top = Most Important)</h4>
             {rankedItems.length > 0 && onClear && (
                <button 
                    onClick={onClear} 
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                    <RefreshCw size={12} /> Reset
                </button>
            )}
         </div>
        
        {rankedItems.length === 0 && (
            <div className="text-slate-400 text-sm italic py-4 text-center border-2 border-dashed border-slate-200 rounded-lg">
                Select items from below to rank them
            </div>
        )}
        <div className="space-y-2">
            {rankedItems.map((val, idx) => {
                const opt = options?.find(o => o.value === val);
                return (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={val} 
                        className="flex items-center gap-3 bg-white p-3 rounded shadow-sm border border-brand-blue"
                    >
                        <div className="bg-brand-blue text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                            {idx + 1}
                        </div>
                        <span className={`flex-1 font-medium text-slate-800 ${fontSizeClass || 'text-base'}`}>{opt?.label}</span>
                        <div className="flex gap-1 shrink-0">
                            <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30 text-slate-500" title="Move Up">
                                <ArrowUp size={18} />
                            </button>
                            <button onClick={() => moveDown(idx)} disabled={idx === rankedItems.length - 1} className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30 text-slate-500" title="Move Down">
                                <ArrowDown size={18} />
                            </button>
                            <button onClick={() => handleRemove(val)} className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors" title="Remove">
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )
            })}
        </div>
      </div>

      {availableOptions.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Available Options (Click to Add)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableOptions.map(opt => (
                    <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(opt.value)}
                        className={`text-left p-3 rounded border border-slate-200 bg-white hover:border-brand-blue hover:text-brand-blue transition-colors text-slate-600 ${fontSizeClass || 'text-sm'}`}
                    >
                        + {opt.label}
                    </motion.button>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};