import React from 'react';

interface IProgressBarProps {
    label: string,
    current: number,
    max: number,
    color?: string,
    type: string
}

const ProgressBar: React.FC<IProgressBarProps> = ({ label, current, max, color, type }) => {

  const percentage = (current / max) * 100;
  
  return (
    <div className="flex items-center gap-2">
      {type === "opened"
        ? <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
      
        : <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
      }
      
      <div className="font-medium">{label} | <span className="text-gray-500 text-sm">{current}</span></div>
      
      <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;