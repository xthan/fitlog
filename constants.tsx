
import { Exercise, MuscleGroup } from './types';

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: '杠铃卧推', group: '胸', isCustom: false },
  { id: '2', name: '哑铃飞鸟', group: '胸', isCustom: false },
  { id: '3', name: '推举', group: '肩', isCustom: false },
  { id: '4', name: '侧平举', group: '肩', isCustom: false },
  { id: '5', name: '引体向上', group: '背', isCustom: false },
  { id: '6', name: '划船', group: '背', isCustom: false },
  { id: '7', name: '深蹲', group: '腿', isCustom: false },
  { id: '8', name: '硬拉', group: '腿', isCustom: false },
  { id: '9', name: '杠铃弯举', group: '胳膊', isCustom: false },
  { id: '10', name: '三头下压', group: '胳膊', isCustom: false },
  { id: '11', name: '卷腹', group: '核心', isCustom: false },
  { id: '12', name: '跑步', group: '有氧', isCustom: false },
];

export const MUSCLE_GROUPS: MuscleGroup[] = ['胸', '肩', '背', '腿', '胳膊', '核心', '有氧'];

export const GROUP_COLORS: Record<MuscleGroup, string> = {
  '胸': '#3b82f6', // blue-500
  '肩': '#f97316', // orange-500
  '背': '#10b981', // emerald-500
  '腿': '#8b5cf6', // violet-500
  '胳膊': '#ec4899', // pink-500
  '核心': '#f59e0b', // amber-500
  '有氧': '#06b6d4', // cyan-500
};
