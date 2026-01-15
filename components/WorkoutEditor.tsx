
import React, { useState, useEffect } from 'react';
import { DailyLog, Exercise, SetRecord, WorkoutExercise, MuscleGroup } from '../types';
import { MUSCLE_GROUPS, GROUP_COLORS } from '../constants';
import { 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  FaceSmileIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface Props {
  log: DailyLog;
  exercises: Exercise[];
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

const WorkoutEditor: React.FC<Props> = ({ log, exercises, onSave, onCancel }) => {
  const [formData, setFormData] = useState<DailyLog>(log);
  const [showExPicker, setShowExPicker] = useState(false);
  const [activeGroupFilter, setActiveGroupFilter] = useState<MuscleGroup | '全部'>('全部');

  // Auto-save logic (local storage backup for in-progress work)
  useEffect(() => {
    localStorage.setItem('fitlog_draft', JSON.stringify(formData));
  }, [formData]);

  const addExercise = (ex: Exercise) => {
    const newWorkoutEx: WorkoutExercise = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      group: ex.group,
      sets: [{ id: Date.now().toString(), weight: 0, reps: 0, completed: false }]
    };
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newWorkoutEx]
    }));
    setShowExPicker(false);
  };

  const updateSet = (exIdx: number, setIdx: number, updates: Partial<SetRecord>) => {
    setFormData(prev => {
      const newExs = [...prev.exercises];
      newExs[exIdx].sets[setIdx] = { ...newExs[exIdx].sets[setIdx], ...updates };
      return { ...prev, exercises: newExs };
    });
  };

  const addSet = (exIdx: number) => {
    setFormData(prev => {
      const newExs = [...prev.exercises];
      const lastSet = newExs[exIdx].sets[newExs[exIdx].sets.length - 1];
      newExs[exIdx].sets.push({
        id: Date.now().toString(),
        weight: lastSet?.weight || 0,
        reps: lastSet?.reps || 0,
        completed: false
      });
      return { ...prev, exercises: newExs };
    });
  };

  const removeSet = (exIdx: number, setIdx: number) => {
    setFormData(prev => {
      const newExs = [...prev.exercises];
      newExs[exIdx].sets.splice(setIdx, 1);
      return { ...prev, exercises: newExs };
    });
  };

  const removeExercise = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== idx)
    }));
  };

  const filteredExercises = activeGroupFilter === '全部' 
    ? exercises 
    : exercises.filter(e => e.group === activeGroupFilter);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="p-4 bg-white border-b sticky top-0 z-20 flex justify-between items-center">
        <button onClick={onCancel} className="text-slate-400 p-2"><XMarkIcon className="w-6 h-6"/></button>
        <h2 className="font-bold text-lg">训练记录</h2>
        <button 
          onClick={() => onSave(formData)} 
          className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md active:scale-95"
        >
          完成
        </button>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">训练日期</label>
            <input 
              type="date" 
              className="w-full bg-white border-0 rounded-xl p-2 text-sm shadow-sm"
              value={formData.date.split('T')[0]}
              onChange={e => setFormData(prev => ({ ...prev, date: new Date(e.target.value).toISOString() }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">今日心情</label>
            <select 
              className="w-full bg-white border-0 rounded-xl p-2 text-sm shadow-sm"
              value={formData.mood}
              onChange={e => setFormData(prev => ({ ...prev, mood: e.target.value }))}
            >
              <option>😊</option>
              <option>🔥</option>
              <option>😴</option>
              <option>😤</option>
              <option>🤕</option>
            </select>
          </div>
        </div>

        {/* Body Stats (Optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">体重 (kg)</label>
            <input 
              type="number" step="0.1" placeholder="--"
              className="w-full bg-white border-0 rounded-xl p-2 text-sm shadow-sm"
              value={formData.weight || ''}
              onChange={e => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || undefined }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">体脂 (%)</label>
            <input 
              type="number" step="0.1" placeholder="--"
              className="w-full bg-white border-0 rounded-xl p-2 text-sm shadow-sm"
              value={formData.bodyFat || ''}
              onChange={e => setFormData(prev => ({ ...prev, bodyFat: parseFloat(e.target.value) || undefined }))}
            />
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {formData.exercises.map((workoutEx, exIdx) => (
            <div key={exIdx} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-6 rounded-full" style={{ backgroundColor: GROUP_COLORS[workoutEx.group] }} />
                   <h3 className="font-bold text-slate-800">{workoutEx.exerciseName}</h3>
                </div>
                <button onClick={() => removeExercise(exIdx)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-4 text-[10px] font-bold text-slate-400 px-2 uppercase">
                  <span>组数</span>
                  <span>重量(KG)</span>
                  <span>次数</span>
                  <span className="text-center">状态</span>
                </div>
                {workoutEx.sets.map((set, setIdx) => (
                  <div key={set.id} className="grid grid-cols-4 items-center gap-2">
                    <div className="text-xs font-bold text-slate-600 bg-slate-50 h-8 flex items-center justify-center rounded-lg">
                      {setIdx + 1}
                    </div>
                    <input 
                      type="number"
                      className="bg-slate-50 border-0 rounded-lg p-1.5 text-center text-sm font-medium focus:ring-1 focus:ring-blue-500"
                      value={set.weight || ''}
                      onChange={e => updateSet(exIdx, setIdx, { weight: parseFloat(e.target.value) || 0 })}
                    />
                    <input 
                      type="number"
                      className="bg-slate-50 border-0 rounded-lg p-1.5 text-center text-sm font-medium focus:ring-1 focus:ring-blue-500"
                      value={set.reps || ''}
                      onChange={e => updateSet(exIdx, setIdx, { reps: parseInt(e.target.value) || 0 })}
                    />
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => updateSet(exIdx, setIdx, { completed: !set.completed })}
                        className={`p-1.5 rounded-lg transition-all ${set.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => removeSet(exIdx, setIdx)} className="p-1.5 text-slate-200 hover:text-red-300">
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addSet(exIdx)}
                  className="w-full py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-slate-100"
                >
                  <PlusIcon className="w-4 h-4" /> 添加一组
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowExPicker(true)}
          className="w-full py-4 bg-blue-600/10 text-blue-600 rounded-3xl border-2 border-dashed border-blue-200 font-bold flex items-center justify-center gap-2 transition-all hover:bg-blue-600/20"
        >
          <PlusIcon className="w-6 h-6" /> 添加动作
        </button>

        <textarea 
          placeholder="有什么想要记录的吗？(如训练状态、饮食感受等)"
          className="w-full bg-white border-0 rounded-3xl p-4 text-sm shadow-sm min-h-[100px] focus:ring-1 focus:ring-blue-500"
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      {/* Exercise Picker Modal */}
      {showExPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">选择训练动作</h3>
              <button onClick={() => setShowExPicker(false)} className="text-slate-400"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            
            <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50 no-scrollbar">
              {['全部', ...MUSCLE_GROUPS].map(g => (
                <button 
                  key={g} 
                  onClick={() => setActiveGroupFilter(g as any)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${activeGroupFilter === g ? 'bg-blue-600 text-white font-bold' : 'bg-white text-slate-500 border border-slate-200'}`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2 grid grid-cols-1 gap-1">
              {filteredExercises.map(ex => (
                <button 
                  key={ex.id} 
                  onClick={() => addExercise(ex)}
                  className="w-full p-3 text-left hover:bg-slate-50 rounded-xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GROUP_COLORS[ex.group] }} />
                    <span className="text-sm font-medium text-slate-700">{ex.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">点击添加</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutEditor;
