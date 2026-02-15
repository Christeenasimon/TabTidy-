
import React from 'react';

interface ScoreMeterProps {
  score: number;
  isDark?: boolean;
}

const ScoreMeter: React.FC<ScoreMeterProps> = ({ score, isDark }) => {
  const getColor = () => {
    if (score > 80) return '#4caf50';
    if (score > 50) return '#ffa175';
    return '#5c0702';
  };

  const textColor = isDark ? 'text-[#ffa175]' : 'text-[#5c0702]';

  return (
    <div className={`${isDark ? 'bg-[#5c0702] bg-opacity-30' : 'bg-white'} p-6 rounded-[20px] shadow-sm flex flex-col items-center justify-center transition-all duration-500`}>
      <h3 className={`${textColor} font-bold text-lg mb-4 transition-colors duration-500`}>Tab Tidy Score</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="stroke-gray-100 opacity-20"
            strokeWidth="3"
            fill="none"
            strokeDasharray="100, 100"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            stroke={getColor()}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold transition-colors duration-500 ${textColor}`}>{score}%</span>
        </div>
      </div>
      <p className={`mt-4 text-sm opacity-70 italic text-center transition-colors duration-500 ${textColor}`}>
        {score === 100 ? "Pure Digital Nirvana 🧘" : score > 70 ? "Looking organized! ✨" : "A little bit cluttered..."}
      </p>
    </div>
  );
};

export default ScoreMeter;
