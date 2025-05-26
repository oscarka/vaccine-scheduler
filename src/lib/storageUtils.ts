import { VaccinationDate } from './scheduleUtils';

// 保存接种排期到本地存储
export const saveVaccinationSchedule = (
  babyName: string,
  birthDate: Date,
  vaccinationUnit: string,
  schedule: VaccinationDate[],
  reminders: { date: Date; message: string }[]
): boolean => {
  try {
    const savedData = {
      babyName,
      birthDate: birthDate.toISOString(),
      vaccinationUnit,
      schedule: schedule.map(item => ({
        ...item,
        scheduledDate: item.scheduledDate.toISOString()
      })),
      reminders: reminders.map(item => ({
        ...item,
        date: item.date.toISOString()
      })),
      savedAt: new Date().toISOString()
    };
    
    // 获取现有保存的记录
    const existingDataStr = localStorage.getItem('vaccinationSchedules');
    const existingData = existingDataStr ? JSON.parse(existingDataStr) : [];
    
    // 添加新记录
    const updatedData = [...existingData, savedData];
    
    // 保存到本地存储
    localStorage.setItem('vaccinationSchedules', JSON.stringify(updatedData));
    
    return true;
  } catch (error) {
    console.error('保存接种排期失败:', error);
    return false;
  }
};

// 获取保存的接种排期列表
export const getSavedVaccinationSchedules = () => {
  try {
    const savedDataStr = localStorage.getItem('vaccinationSchedules');
    if (!savedDataStr) {
      return [];
    }
    
    const savedData = JSON.parse(savedDataStr);
    
    // 转换日期字符串为Date对象
    return savedData.map((item: any) => ({
      ...item,
      birthDate: new Date(item.birthDate),
      schedule: item.schedule.map((scheduleItem: any) => ({
        ...scheduleItem,
        scheduledDate: new Date(scheduleItem.scheduledDate)
      })),
      reminders: item.reminders.map((reminderItem: any) => ({
        ...reminderItem,
        date: new Date(reminderItem.date)
      })),
      savedAt: new Date(item.savedAt)
    }));
  } catch (error) {
    console.error('获取保存的接种排期失败:', error);
    return [];
  }
};

// 删除保存的接种排期
export const deleteSavedVaccinationSchedule = (index: number): boolean => {
  try {
    const savedDataStr = localStorage.getItem('vaccinationSchedules');
    if (!savedDataStr) {
      return false;
    }
    
    const savedData = JSON.parse(savedDataStr);
    
    // 删除指定索引的记录
    savedData.splice(index, 1);
    
    // 保存更新后的数据
    localStorage.setItem('vaccinationSchedules', JSON.stringify(savedData));
    
    return true;
  } catch (error) {
    console.error('删除接种排期失败:', error);
    return false;
  }
};

// 模拟微信提醒功能
export interface WechatReminder {
  id: string;
  message: string;
  date: Date;
  isRead: boolean;
}

// 生成模拟微信提醒
export const generateWechatReminders = (
  reminders: { date: Date; message: string }[]
): WechatReminder[] => {
  return reminders.map((reminder, index) => ({
    id: `reminder-${index}-${reminder.date.getTime()}`,
    message: reminder.message,
    date: reminder.date,
    isRead: false
  }));
};

// 标记提醒为已读
export const markReminderAsRead = (reminders: WechatReminder[], id: string): WechatReminder[] => {
  return reminders.map(reminder => 
    reminder.id === id ? { ...reminder, isRead: true } : reminder
  );
};

// 获取最近的提醒
export const getUpcomingReminders = (reminders: WechatReminder[], count: number = 3): WechatReminder[] => {
  const today = new Date();
  
  return reminders
    .filter(reminder => reminder.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, count);
};
