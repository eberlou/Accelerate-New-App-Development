import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  // Determine the color based on the percentage
  const getColor = () => {
    if (percentage < 50) return 'bg-red-600';
    if (percentage < 70) return 'bg-orange-500';
    if (percentage < 90) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="w-full relative h-6">
      <div
        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out ${getColor()}`}
        style={{ width: `${percentage}%` }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;