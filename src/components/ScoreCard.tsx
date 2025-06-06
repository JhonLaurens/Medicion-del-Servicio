
import React from 'react';

interface ScoreCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  footerText?: string;
  valueClassName?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, value, icon, footerText, valueClassName = 'text-brand-primary' }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-600">{title}</h3>
          {icon && <div className="text-brand-secondary opacity-75">{icon}</div>}
        </div>
        <p className={`text-3xl font-bold ${valueClassName}`}>{value}</p>
      </div>
      {footerText && <p className="text-xs text-slate-500 mt-3">{footerText}</p>}
    </div>
  );
};

export default ScoreCard;
