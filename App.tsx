
import React, { useState, useEffect, useMemo } from 'react';
import { 
  HomeIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  Cog6ToothIcon,
  PlusIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { AppState, DailyLog, Exercise, MuscleGroup } from './types';
import { DEFAULT_EXERCISES } from './constants';

// Sub-components
import Dashboard from './components/Dashboard';
import WorkoutEditor from './components/WorkoutEditor';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import ExerciseLibrary from './components/ExerciseLibrary';
import Settings from './components/Settings';

const STORAGE_KEY = 'fitlog_v1_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'stats' | 'library' | 'settings'>('home');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Persistence State
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    return {
      logs: [],
      customExercises: [],
      remindersEnabled: false,
      reminderTime: '18:00'
    };
  });

  // Save on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const allExercises = useMemo(() => {
    return [...DEFAULT_EXERCISES, ...state.customExercises];
  }, [state.customExercises]);

  const handleSaveLog = (log: DailyLog) => {
    setState(prev => {
      const existingIndex = prev.logs.findIndex(l => l.id === log.id);
      let newLogs = [...prev.logs];
      if (existingIndex >= 0) {
        newLogs[existingIndex] = log;
      } else {
        newLogs.push(log);
      }
      return { ...prev, logs: newLogs };
    });
    setIsEditing(false);
    setEditingLogId(null);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm('确定要删除这条训练记录吗？')) {
      setState(prev => ({
        ...prev,
        logs: prev.logs.filter(l => l.id !== id)
      }));
    }
  };

  const handleAddExercise = (name: string, group: MuscleGroup) => {
    const newEx: Exercise = {
      id: Date.now().toString(),
      name,
      group,
      isCustom: true
    };
    setState(prev => ({
      ...prev,
      customExercises: [...prev.customExercises, newEx]
    }));
  };

  const handleDeleteExercise = (id: string) => {
    setState(prev => ({
      ...prev,
      customExercises: prev.customExercises.filter(e => e.id !== id)
    }));
  };

  const exportMarkdown = () => {
    let md = `# FitLog 健身记录导出\n\n`;
    state.logs.forEach(log => {
      md += `## ${new Date(log.date).toLocaleDateString('zh-CN')} ${log.mood || ''}\n`;
      if (log.weight) md += `体重: ${log.weight}kg | 体脂: ${log.bodyFat || '--'}%\n`;
      log.exercises.forEach(ex => {
        md += `### ${ex.exerciseName} (${ex.group})\n`;
        ex.sets.forEach((set, idx) => {
          md += `- 第 ${idx + 1} 组: ${set.weight}kg x ${set.reps}次 ${set.completed ? '✅' : '❌'}\n`;
        });
      });
      if (log.notes) md += `笔记: ${log.notes}\n`;
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitlog_backup_${new Date().toISOString().slice(0,10)}.md`;
    a.click();
  };

  const renderContent = () => {
    if (isEditing) {
      const initialLog = editingLogId 
        ? state.logs.find(l => l.id === editingLogId) 
        : {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            exercises: [],
            mood: '😊',
            notes: ''
          };
      return (
        <WorkoutEditor 
          log={initialLog as DailyLog} 
          exercises={allExercises} 
          onSave={handleSaveLog} 
          onCancel={() => { setIsEditing(false); setEditingLogId(null); }}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard 
          logs={state.logs} 
          onEdit={(id) => { setEditingLogId(id); setIsEditing(true); }}
          onDelete={handleDeleteLog}
          onStartWorkout={() => setIsEditing(true)}
        />;
      case 'calendar':
        return <CalendarView logs={state.logs} onSelectLog={(id) => { setEditingLogId(id); setIsEditing(true); }} />;
      case 'stats':
        return <Analytics logs={state.logs} />;
      case 'library':
        return <ExerciseLibrary 
          customExercises={state.customExercises} 
          onAdd={handleAddExercise} 
          onDelete={handleDeleteExercise} 
        />;
      case 'settings':
        return <Settings 
          state={state} 
          onUpdate={(updates) => setState(prev => ({ ...prev, ...updates }))} 
          onExport={exportMarkdown}
        />;
      default:
        return <Dashboard logs={state.logs} onEdit={setEditingLogId} onDelete={handleDeleteLog} onStartWorkout={() => setIsEditing(true)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            FitLog
          </h1>
          <p className="text-xs text-slate-400">记录每一次蜕变</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all active:scale-95"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
        {renderContent()}
      </main>

      {/* Navigation */}
      {!isEditing && (
        <nav className="flex justify-around items-center py-3 bg-white border-t border-slate-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sticky bottom-0">
          <NavItem 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<HomeIcon className="w-6 h-6" />} 
            label="首页" 
          />
          <NavItem 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
            icon={<CalendarIcon className="w-6 h-6" />} 
            label="日历" 
          />
          <NavItem 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<ChartBarIcon className="w-6 h-6" />} 
            label="统计" 
          />
          <NavItem 
            active={activeTab === 'library'} 
            onClick={() => setActiveTab('library')} 
            icon={<BookOpenIcon className="w-6 h-6" />} 
            label="动作库" 
          />
          <NavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Cog6ToothIcon className="w-6 h-6" />} 
            label="设置" 
          />
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-600 font-medium' : 'text-slate-400'}`}
  >
    {icon}
    <span className="text-[10px]">{label}</span>
  </button>
);

export default App;
