
import React, { useMemo } from 'react';
import { DailyLog, MuscleGroup } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { MUSCLE_GROUPS, GROUP_COLORS } from '../constants';

interface Props {
  logs: DailyLog[];
}

const Analytics: React.FC<Props> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate SBD PRs
  const sbdPRs = useMemo(() => {
    const prs = { squat: 0, bench: 0, deadlift: 0 };
    logs.forEach(log => {
      log.exercises.forEach(ex => {
        const maxWeight = Math.max(...ex.sets.map(s => s.completed ? s.weight : 0), 0);
        if (ex.exerciseName.includes('深蹲')) prs.squat = Math.max(prs.squat, maxWeight);
        if (ex.exerciseName.includes('卧推')) prs.bench = Math.max(prs.bench, maxWeight);
        if (ex.exerciseName.includes('硬拉')) prs.deadlift = Math.max(prs.deadlift, maxWeight);
      });
    });
    return prs;
  }, [logs]);

  // Daily Volume Trend
  const volumeData = useMemo(() => {
    return sortedLogs.map(log => {
      const volume = log.exercises.reduce((acc, ex) => {
        return acc + ex.sets.reduce((setAcc, s) => setAcc + (s.completed ? s.weight * s.reps : 0), 0);
      }, 0);
      return {
        date: new Date(log.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
        volume: Math.round(volume)
      };
    }).slice(-15); // Last 15 sessions
  }, [sortedLogs]);

  // Muscle Group Distribution
  const muscleDistribution = useMemo(() => {
    const counts: Record<MuscleGroup, number> = {} as any;
    MUSCLE_GROUPS.forEach(g => counts[g] = 0);
    logs.forEach(log => {
      log.exercises.forEach(ex => {
        counts[ex.group] += ex.sets.filter(s => s.completed).length;
      });
    });
    return MUSCLE_GROUPS.map(g => ({ name: g, count: counts[g], color: GROUP_COLORS[g] })).filter(item => item.count > 0);
  }, [logs]);

  // Body Metrics
  const bodyMetrics = useMemo(() => {
    return sortedLogs.filter(l => l.weight).map(log => ({
      date: new Date(log.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      weight: log.weight,
      bodyFat: log.bodyFat
    })).slice(-10);
  }, [sortedLogs]);

  return (
    <div className="p-4 space-y-6 pb-12">
      {/* SBD PR Cards */}
      <div className="grid grid-cols-3 gap-3">
        <PRCard label="深蹲 (S)" value={sbdPRs.squat} color="bg-red-50" textColor="text-red-600" />
        <PRCard label="卧推 (B)" value={sbdPRs.bench} color="bg-blue-50" textColor="text-blue-600" />
        <PRCard label="硬拉 (D)" value={sbdPRs.deadlift} color="bg-slate-50" textColor="text-slate-800" />
      </div>

      {/* Volume Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-4">总容量趋势 (KG)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Muscle Groups */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-4">训练部位分布</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={muscleDistribution} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {muscleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Body Metrics Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-4">身体指标变化</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bodyMetrics}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip />
              <Line name="体重(kg)" type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2} />
              <Line name="体脂(%)" type="monotone" dataKey="bodyFat" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const PRCard = ({ label, value, color, textColor }: { label: string, value: number, color: string, textColor: string }) => (
  <div className={`${color} p-4 rounded-3xl text-center border border-white/50`}>
    <div className="text-[10px] font-bold text-slate-400 mb-1">{label}</div>
    <div className={`text-xl font-black ${textColor}`}>{value || '--'}<span className="text-[10px] ml-0.5 font-normal">KG</span></div>
  </div>
);

export default Analytics;
