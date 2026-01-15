
import React from 'react';
import { DailyLog } from '../types';
import { FireIcon, TrophyIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

interface Props {
  logs: DailyLog[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStartWorkout: () => void;
}

const Dashboard: React.FC<Props> = ({ logs, onEdit, onDelete, onStartWorkout }) => {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const stats = {
    totalWorkouts: logs.length,
    consecutiveDays: 0, // Simplified streak
    topExercise: '深蹲'
  };

  return (
    <div className="p-4 space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200">
          <FireIcon className="w-8 h-8 opacity-40 mb-2" />
          <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
          <div className="text-xs opacity-80">累计训练次数</div>
        </div>
        <div className="bg-orange-500 rounded-3xl p-5 text-white shadow-lg shadow-orange-200">
          <TrophyIcon className="w-8 h-8 opacity-40 mb-2" />
          <div className="text-3xl font-bold">PR</div>
          <div className="text-xs opacity-80">查看个人纪录</div>
        </div>
      </div>

      {/* Recent History */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">训练动态</h2>
          <button onClick={onStartWorkout} className="text-sm text-blue-600 font-medium">开始记录</button>
        </div>

        {sortedLogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
            <ClipboardDocumentCheckIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">还没有任何记录，开始你的健身之旅吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLogs.slice(0, 5).map(log => (
              <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-start group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{log.mood || '💪'}</span>
                    <h3 className="font-bold text-slate-800">
                      {new Date(log.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {log.exercises.map((ex, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                        {ex.exerciseName}
                      </span>
                    ))}
                  </div>
                  {log.notes && <p className="text-xs text-slate-400 line-clamp-1 italic">"{log.notes}"</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => onEdit(log.id)} className="text-xs font-medium text-blue-500 hover:text-blue-700">编辑</button>
                  <button onClick={() => onDelete(log.id)} className="text-xs font-medium text-red-400 hover:text-red-600">删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
