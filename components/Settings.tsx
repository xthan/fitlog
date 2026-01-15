
import React from 'react';
import { AppState } from '../types';
import { 
  BellIcon, 
  ArrowDownTrayIcon, 
  TrashIcon, 
  InformationCircleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Props {
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
  onExport: () => void;
}

const Settings: React.FC<Props> = ({ state, onUpdate, onExport }) => {
  const clearAllData = () => {
    if (confirm('此操作将永久删除所有本地训练记录，确定吗？')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleNotifications = async () => {
    if (!state.remindersEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdate({ remindersEnabled: true });
        alert('提醒功能已开启！(需应用保持后台运行)');
      }
    } else {
      onUpdate({ remindersEnabled: false });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">系统偏好</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BellIcon className="w-5 h-5"/></div>
              <div>
                <div className="text-sm font-bold text-slate-700">训练提醒</div>
                <div className="text-[10px] text-slate-400">每日定时推送训练通知</div>
              </div>
            </div>
            <button 
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors relative ${state.remindersEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${state.remindersEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><GlobeAltIcon className="w-5 h-5"/></div>
              <div>
                <div className="text-sm font-bold text-slate-700">时间与地区</div>
                <div className="text-[10px] text-slate-400">当前：中国 (UTC+8)</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-300">自动同步</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">数据导出</h3>
        <div className="space-y-4">
          <button 
            onClick={onExport}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ArrowDownTrayIcon className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">导出 Markdown 全量数据</span>
            </div>
            <span className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100">下载备份</span>
          </button>

          <button 
            onClick={clearAllData}
            className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="text-sm font-bold">清除所有记录</span>
          </button>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">关于应用</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl shadow-inner" />
          <div>
            <div className="text-sm font-black text-slate-800 tracking-tight">FitLog v1.0.0</div>
            <div className="text-[10px] text-slate-400">托管于 xthan.github.io/fitlog</div>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-slate-400 leading-relaxed italic">
          "每一个伟大的变化，都源自坚持不懈的记录。保持运动，保持热爱。"
        </p>
      </section>
    </div>
  );
};

export default Settings;
