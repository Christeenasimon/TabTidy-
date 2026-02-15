
import React, { useState, useEffect, useMemo } from 'react';
import { Tab, TabCategory, OverwhelmLevel, Badge } from './types';
import { MOCK_TABS, INITIAL_BADGES, COLORS } from './constants';
import TabCard from './components/TabCard';
import ScoreMeter from './components/ScoreMeter';
import { getSmartTabGrouping, getTabSummary } from './services/geminiService';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>(MOCK_TABS);
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [points, setPoints] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showTherapist, setShowTherapist] = useState(false);
  const [groupSummaries, setGroupSummaries] = useState<Record<string, string>>({});

  // Dynamic colors based on focus mode
  const textColor = isFocusMode ? 'text-[#ffa175]' : 'text-[#5c0702]';
  const subtextColor = isFocusMode ? 'text-[#ffa175] opacity-70' : 'text-[#5c0702] opacity-90';
  const bgColor = isFocusMode ? 'bg-[#2a0301]' : 'bg-[#ffa175]';

  // Calculations
  const overwhelmLevel = useMemo<OverwhelmLevel>(() => {
    if (tabs.length > 20) return 'Brain meltdown mode';
    if (tabs.length > 10) return 'Mild chaos';
    return 'Calm';
  }, [tabs.length]);

  const tidyScore = useMemo(() => {
    if (tabs.length === 0) return 100;
    const duplicatePenalty = tabs.filter(t => t.isDuplicate).length * 10;
    const volumePenalty = Math.max(0, (tabs.length - 5) * 5);
    return Math.max(0, 100 - duplicatePenalty - volumePenalty);
  }, [tabs]);

  // Actions
  const handleCloseTab = (id: string) => {
    setTabs(prev => prev.filter(t => t.id !== id));
    setPoints(prev => prev + 5);
  };

  const handleConvertToTask = (tab: Tab) => {
    setTasks(prev => [...prev, { id: tab.id, title: tab.title }]);
    handleCloseTab(tab.id);
    setPoints(prev => prev + 15);
  };

  const handleSmartGroup = async () => {
    setIsAiLoading(true);
    const mapping = await getSmartTabGrouping(tabs);
    if (Object.keys(mapping).length > 0) {
      setTabs(prev => prev.map(t => ({
        ...t,
        category: mapping[t.id] || t.category
      })));
      setPoints(prev => prev + 50);
      setBadges(prev => prev.map(b => b.id === 'b3' ? { ...b, unlocked: true } : b));
    }
    setIsAiLoading(false);
  };

  const handleGenerateSummary = async (category: TabCategory) => {
    const groupTabs = tabs.filter(t => t.category === category);
    if (groupTabs.length === 0) return;
    
    setIsAiLoading(true);
    const summary = await getTabSummary(groupTabs);
    setGroupSummaries(prev => ({ ...prev, [category]: summary }));
    setIsAiLoading(false);
  };

  const closeDuplicates = () => {
    const uniqueTabs = tabs.filter(t => !t.isDuplicate);
    setPoints(prev => prev + (tabs.length - uniqueTabs.length) * 10);
    setTabs(uniqueTabs);
  };

  useEffect(() => {
    if (tabs.length > 15 && !showTherapist) {
      setShowTherapist(true);
    }
  }, [tabs.length, showTherapist]);

  // View filtering for focus mode
  const displayedTabs = isFocusMode ? tabs.slice(0, 3) : tabs;

  return (
    <div className={`min-h-screen transition-all duration-700 ${bgColor}`}>
      
      {/* Background Blobs */}
      {!isFocusMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5c0702] opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className={`text-5xl font-extrabold tracking-tight transition-colors duration-500 ${textColor}`}>
              TabTidy
            </h1>
            <p className={`text-lg transition-colors duration-500 mt-2 font-medium ${subtextColor}`}>
              A soft and gentle sanctuary for your browser tabs ✨
            </p>
          </div>

          <div className="flex space-x-4 items-center">
            <div className="bg-[#5c0702] text-[#ffa175] px-6 py-3 rounded-full flex items-center font-bold shadow-lg border-2 border-transparent hover:border-[#ffa175] transition-all cursor-default">
              <span className="mr-2">✨</span> {points} points
            </div>
            <button 
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 ${isFocusMode ? 'bg-[#5c0702] text-[#ffa175]' : 'bg-white text-[#5c0702]'}`}
            >
              {isFocusMode ? '🌙 Soft Focus On' : '☀️ Daily Mode'}
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Stats */}
          <aside className="lg:col-span-3 space-y-6">
            <ScoreMeter score={tidyScore} isDark={isFocusMode} />
            
            <div className={`${isFocusMode ? 'bg-[#5c0702] bg-opacity-30' : 'bg-white'} p-6 rounded-[20px] shadow-sm transition-all duration-500 border-b-4 border-[#5c0702] border-opacity-10`}>
              <h3 className={`${textColor} font-bold mb-4 flex items-center`}>
                <span className="mr-2">☁️</span> Clarity Meter
              </h3>
              <div className="w-full h-4 bg-gray-100 bg-opacity-20 rounded-full overflow-hidden mb-2 p-1">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${overwhelmLevel === 'Calm' ? 'bg-green-300' : overwhelmLevel === 'Mild chaos' ? 'bg-orange-300' : 'bg-red-400'}`}
                  style={{ width: `${Math.min(100, (tabs.length / 30) * 100)}%` }}
                ></div>
              </div>
              <p className={`${textColor} text-xs font-semibold opacity-60 uppercase tracking-wider`}>{overwhelmLevel}</p>
            </div>

            {tasks.length > 0 && (
              <div className={`${isFocusMode ? 'bg-[#ffa175] text-[#5c0702]' : 'bg-[#5c0702] text-[#ffa175]'} p-6 rounded-[20px] shadow-lg transition-all duration-500`}>
                <h3 className="font-bold mb-4 flex items-center">
                  <span className="mr-2">📝</span> To-Do List
                </h3>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className={`rounded-full ${isFocusMode ? 'accent-[#5c0702]' : 'accent-[#ffa175]'}`} onChange={() => setTasks(prev => prev.filter(t => t.id !== task.id))} />
                      <span className="truncate opacity-90">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`${isFocusMode ? 'bg-[#5c0702] bg-opacity-30' : 'bg-white'} p-6 rounded-[20px] shadow-sm transition-all duration-500`}>
              <h3 className={`${textColor} font-bold mb-4 flex items-center`}>
                <span className="mr-2">🎀</span> Collection
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {badges.map(b => (
                  <div key={b.id} title={b.description} className={`flex items-center justify-center w-12 h-12 rounded-2xl text-2xl transition-all transform hover:rotate-6 ${b.unlocked ? 'bg-[#ffa175] shadow-sm grayscale-0 text-[#5c0702]' : 'bg-gray-100 bg-opacity-10 grayscale opacity-30'}`}>
                    {b.icon}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Tab Area */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* Action Bar */}
            <div className={`${isFocusMode ? 'bg-[#5c0702] bg-opacity-40' : 'bg-white'} p-5 rounded-[25px] shadow-sm flex flex-wrap gap-4 items-center border border-[#ffa175] border-opacity-10 transition-all duration-500`}>
              <button 
                onClick={handleSmartGroup}
                disabled={isAiLoading}
                className={`${isFocusMode ? 'bg-[#ffa175] text-[#5c0702]' : 'bg-[#5c0702] text-[#ffa175]'} px-7 py-3 rounded-full font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center disabled:opacity-50`}
              >
                {isAiLoading ? '✨ Tidying...' : '✨ Magic Group'}
              </button>
              <button 
                onClick={closeDuplicates}
                className={`${isFocusMode ? 'bg-white bg-opacity-10 text-[#ffa175]' : 'bg-[#ffa175] bg-opacity-20 text-[#5c0702]'} px-7 py-3 rounded-full font-bold hover:bg-opacity-30 transition-all`}
              >
                ☁️ Sweep Duplicates
              </button>
              <button 
                onClick={() => setTabs([])}
                className={`${isFocusMode ? 'text-white text-opacity-40 hover:text-opacity-100' : 'text-gray-400 hover:bg-gray-100'} px-7 py-3 rounded-full font-bold transition-all ml-auto`}
              >
                Clear All
              </button>
            </div>

            {/* Tab Groups */}
            <div className="space-y-16">
              {Object.values(TabCategory).map(cat => {
                const categoryTabs = displayedTabs.filter(t => t.category === cat);
                if (categoryTabs.length === 0) return null;

                return (
                  <section key={cat} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-10 ${isFocusMode ? 'bg-[#ffa175]' : 'bg-[#5c0702]'} rounded-full shadow-sm transition-colors duration-500`}></div>
                        <h2 className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${textColor}`}>{cat}</h2>
                        <span className={`${isFocusMode ? 'bg-[#5c0702] text-[#ffa175]' : 'bg-white text-[#5c0702]'} border border-[#ffa175] border-opacity-10 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all duration-500`}>
                          {categoryTabs.length} tabs
                        </span>
                      </div>
                      <button 
                        onClick={() => handleGenerateSummary(cat)}
                        className={`text-xs font-bold transition-all duration-500 ${isFocusMode ? 'text-[#ffa175] bg-[#5c0702] bg-opacity-50' : 'text-[#5c0702] bg-white'} px-3 py-2 rounded-full shadow-sm hover:shadow-md border border-[#ffa175] border-opacity-10`}
                      >
                        Ask AI for Summary ✨
                      </button>
                    </div>

                    {groupSummaries[cat] && (
                      <div className={`${isFocusMode ? 'bg-[#5c0702] bg-opacity-20' : 'bg-white bg-opacity-70'} p-6 rounded-[30px] border-2 border-dashed border-[#ffa175] shadow-inner transition-all duration-500`}>
                        <p className={`${textColor} text-sm leading-relaxed font-medium`}>
                          {groupSummaries[cat]}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {categoryTabs.map(tab => (
                        <TabCard 
                          key={tab.id} 
                          tab={tab} 
                          onClose={handleCloseTab} 
                          onToTask={() => handleConvertToTask(tab)}
                          isDark={isFocusMode}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {displayedTabs.length === 0 && (
              <div className="text-center py-24 flex flex-col items-center animate-pulse-slow">
                <div className={`text-8xl mb-8 opacity-40 transition-colors duration-500 ${textColor}`}>✨</div>
                <h3 className={`text-3xl font-bold transition-colors duration-500 ${textColor}`}>A clean, cozy space.</h3>
                <p className={`${subtextColor} mt-3 text-lg transition-colors duration-500`}>Your mind and browser are finally at peace.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Digital Declutter Therapist Modal */}
      {showTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c0702] bg-opacity-20 backdrop-blur-xl">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl text-center space-y-8 animate-float border-4 border-[#ffa175] border-opacity-20">
            <div className="text-7xl">🦢</div>
            <h2 className="text-4xl font-extrabold text-[#5c0702] tracking-tight">Time for a breath.</h2>
            <p className="text-[#5c0702] opacity-90 leading-relaxed text-lg font-medium">
              "It's okay to feel overwhelmed. Let's gently tidy up {tabs.length} tabs and find some quiet space together."
            </p>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setShowTherapist(false);
                  closeDuplicates();
                }}
                className="bg-[#5c0702] text-[#ffa175] py-5 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all text-xl"
              >
                Let's tidy up together ✨
              </button>
              <button 
                onClick={() => setShowTherapist(false)}
                className="text-[#5c0702] text-sm font-bold opacity-40 hover:opacity-100 transition-opacity"
              >
                Maybe in a little while
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Focus Mode Overlay Effect */}
      {isFocusMode && (
        <div className="fixed inset-0 pointer-events-none z-0 border-[40px] border-[#ffa175] border-opacity-5 animate-pulse-slow"></div>
      )}
    </div>
  );
};

export default App;
