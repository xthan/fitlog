
import React, { useState } from 'react';
import { Exercise, MuscleGroup } from '../types';
import { MUSCLE_GROUPS, GROUP_COLORS, DEFAULT_EXERCISES } from '../constants';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Props {
  customExercises: Exercise[];
  onAdd: (name: string, group: MuscleGroup) => void;
  onDelete: (id: string) => void;
}

const ExerciseLibrary: React.FC<Props> = ({ customExercises, onAdd, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<MuscleGroup>('胸');

  const allEx = [...DEFAULT_EXERCISES, ...customExercises];
  const filtered = allEx.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="搜索动作..."
          className="w-full bg-white border-0 rounded-2xl py-3 pl-10 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center px-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">动作库清单</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
        >
          自定义动作
        </button>
      </div>

      <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 space-y-1">
        {filtered.map(ex => (
          <div key={ex.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS[ex.group] }} />
              <div>
                <div className="text-sm font-bold text-slate-700">{ex.name}</div>
                <div className="text-[10px] text-slate-400">{ex.group}</div>
              </div>
            </div>
            {ex.isCustom && (
              <button onClick={() => onDelete(ex.id)} className="p-2 text-slate-300 hover:text-red-500">
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold mb-4">添加自定义动作</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">动作名称</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm"
                  placeholder="如：哈克深蹲"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">肌群分类</label>
                <div className="grid grid-cols-3 gap-2">
                  {MUSCLE_GROUPS.map(g => (
                    <button 
                      key={g}
                      onClick={() => setNewGroup(g)}
                      className={`py-2 text-xs rounded-xl border transition-all ${newGroup === g ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (newName) {
                      onAdd(newName, newGroup);
                      setNewName('');
                      setShowAddForm(false);
                    }
                  }}
                  className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 active:scale-95"
                >
                  确定添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
