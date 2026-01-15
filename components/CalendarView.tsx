
import React, { useState } from 'react';
import { DailyLog } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Props {
  logs: DailyLog[];
  onSelectLog: (id: string) => void;
}

const CalendarView: React.FC<Props> = ({ logs, onSelectLog }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const getLogsForDay = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return logs.filter(l => new Date(l.date).toDateString() === checkDate);
  };

  const days = [];
  // Empty spaces for start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-14"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayLogs = getLogsForDay(d);
    const hasWorkout = dayLogs.length > 0;
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();

    days.push(
      <div 
        key={d} 
        onClick={() => hasWorkout && onSelectLog(dayLogs[0].id)}
        className={`h-14 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all ${hasWorkout ? 'hover:bg-blue-50' : 'hover:bg-slate-50'}`}
      >
        <span className={`text-xs font-bold ${isToday ? 'bg-orange-500 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-600'}`}>
          {d}
        </span>
        {hasWorkout && (
          <div className="flex gap-0.5 mt-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">
            {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><ChevronLeftIcon className="w-5 h-5"/></button>
            <button onClick={nextMonth} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><ChevronRightIcon className="w-5 h-5"/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-[10px] text-slate-400 font-bold">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" /> 训练日
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" /> 今天
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
