
import React from 'react';
import { Tab } from '../types';

interface TabCardProps {
  tab: Tab;
  onClose: (id: string) => void;
  onToTask?: () => void;
  isDark?: boolean;
}

const TabCard: React.FC<TabCardProps> = ({ tab, onClose, onToTask, isDark }) => {
  const daysOpen = Math.floor((Date.now() - tab.lastAccessed) / (1000 * 60 * 60 * 24));

  // Card text colors
  const mainTextColor = isDark ? 'text-[#ffa175]' : 'text-[#5c0702]';
  const subTextColor = isDark ? 'text-[#ffa175] opacity-50' : 'text-[#5c0702] opacity-50';
  const cardBg = isDark ? 'bg-[#5c0702] bg-opacity-40' : 'bg-white';

  return (
    <div className={`relative group p-5 ${cardBg} rounded-[28px] shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent ${isDark ? 'hover:border-[#ffa175]' : 'hover:border-[#5c0702] border-opacity-5'} flex items-center space-x-4`}>
      <div className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-[#ffa175] bg-opacity-20' : 'bg-[#ffa175] bg-opacity-10'} flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner transition-colors duration-500`}>
        {tab.favicon ? (
          <img src={tab.favicon} alt="" className={`w-7 h-7 object-contain ${isDark ? '' : 'grayscale-[0.2]'}`} />
        ) : (
          <span className="text-2xl">📄</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`${mainTextColor} font-bold truncate text-base mb-0.5 transition-colors duration-500`}>{tab.title}</h4>
        <p className={`${subTextColor} text-xs truncate font-medium transition-colors duration-500`}>{tab.url}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {tab.isDuplicate && (
            <span className={`${isDark ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-500'} text-[10px] px-2.5 py-1 rounded-full font-bold tracking-tight uppercase`}>Duplicate</span>
          )}
          {daysOpen > 0 ? (
            <span className={`${isDark ? 'bg-orange-900 text-orange-200' : 'bg-orange-50 text-orange-600'} text-[10px] px-2.5 py-1 rounded-full font-bold`}>
              {daysOpen}d active
            </span>
          ) : (
            <span className={`${isDark ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-600'} text-[10px] px-2.5 py-1 rounded-full font-bold uppercase`}>Fresh</span>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onClose(tab.id)}
          className={`w-8 h-8 ${isDark ? 'bg-[#ffa175] text-[#5c0702]' : 'bg-gray-50 text-[#5c0702]'} rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm`}
          title="Close Tab"
        >
          ×
        </button>
        <button 
          onClick={onToTask}
          className={`w-8 h-8 ${isDark ? 'bg-white text-[#5c0702]' : 'bg-[#5c0702] text-[#ffa175]'} rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md`}
          title="Turn into To-Do"
        >
          ✓
        </button>
      </div>
    </div>
  );
};

export default TabCard;
