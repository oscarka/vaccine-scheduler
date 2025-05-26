import { getAllVaccines, getVaccineById } from './vaccineData';

// 接种日期计算接口
export interface VaccinationDate {
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  scheduledDate: Date;
  ageInMonths: number;
  isCompleted: boolean;
  isNIP: boolean;
  manufacturer?: string;
}

// 计算月龄
export const calculateAgeInMonths = (birthDate: Date, targetDate: Date = new Date()): number => {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();
  
  let ageInMonths = (targetYear - birthYear) * 12 + (targetMonth - birthMonth);
  
  // 如果目标日期的日小于出生日期的日，则减去一个月
  if (targetDay < birthDay) {
    ageInMonths--;
  }
  
  return ageInMonths;
};

// 根据月龄计算日期
export const calculateDateFromMonths = (birthDate: Date, months: number): Date => {
  const result = new Date(birthDate);
  result.setMonth(result.getMonth() + Math.floor(months));
  
  // 处理小数部分（天数）
  const daysInMonth = 30; // 简化计算，假设每月30天
  const remainingDays = Math.round((months % 1) * daysInMonth);
  result.setDate(result.getDate() + remainingDays);
  
  return result;
};

// 生成疫苗接种排期
export const generateVaccinationSchedule = (
  birthDate: Date,
  selectedNonNipVaccineIds: string[] = []
): VaccinationDate[] => {
  if (!birthDate) {
    return [];
  }
  
  const schedule: VaccinationDate[] = [];
  const allVaccines = getAllVaccines();
  const today = new Date();
  
  // 处理国家免疫规划疫苗
  const nipVaccines = allVaccines.filter(vaccine => vaccine.isNIP);
  
  nipVaccines.forEach(vaccine => {
    vaccine.scheduleAges.forEach((ageInMonths, index) => {
      const scheduledDate = calculateDateFromMonths(birthDate, ageInMonths);
      const isCompleted = scheduledDate < today;
      
      schedule.push({
        vaccineId: vaccine.id,
        vaccineName: vaccine.name,
        doseNumber: index + 1,
        scheduledDate,
        ageInMonths,
        isCompleted,
        isNIP: true
      });
    });
  });
  
  // 处理选定的非免疫规划疫苗
  if (selectedNonNipVaccineIds.length > 0) {
    selectedNonNipVaccineIds.forEach(vaccineId => {
      const vaccine = getVaccineById(vaccineId);
      if (vaccine) {
        vaccine.scheduleAges.forEach((ageInMonths, index) => {
          const scheduledDate = calculateDateFromMonths(birthDate, ageInMonths);
          const isCompleted = scheduledDate < today;
          
          schedule.push({
            vaccineId: vaccine.id,
            vaccineName: vaccine.name,
            doseNumber: index + 1,
            scheduledDate,
            ageInMonths,
            isCompleted,
            isNIP: false,
            manufacturer: vaccine.manufacturer
          });
        });
      }
    });
  }
  
  // 按日期排序
  return schedule.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
};

// 生成提醒日期（接种日期前7天和前1天）
export const generateReminders = (schedule: VaccinationDate[]): { date: Date; message: string }[] => {
  const reminders: { date: Date; message: string }[] = [];
  const today = new Date();
  
  schedule.forEach(item => {
    if (!item.isCompleted) {
      // 接种前7天提醒
      const reminder7Days = new Date(item.scheduledDate);
      reminder7Days.setDate(reminder7Days.getDate() - 7);
      
      if (reminder7Days > today) {
        reminders.push({
          date: reminder7Days,
          message: `提醒：您的宝宝将在7天后（${item.scheduledDate.toLocaleDateString('zh-CN')}）接种${item.vaccineName}第${item.doseNumber}剂`
        });
      }
      
      // 接种前1天提醒
      const reminder1Day = new Date(item.scheduledDate);
      reminder1Day.setDate(reminder1Day.getDate() - 1);
      
      if (reminder1Day > today) {
        reminders.push({
          date: reminder1Day,
          message: `提醒：您的宝宝将在明天（${item.scheduledDate.toLocaleDateString('zh-CN')}）接种${item.vaccineName}第${item.doseNumber}剂，请做好准备`
        });
      }
    }
  });
  
  // 按日期排序
  return reminders.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// 按年龄段分组疫苗接种排期
export const groupScheduleByAgeStage = (schedule: VaccinationDate[]): Record<string, VaccinationDate[]> => {
  const grouped: Record<string, VaccinationDate[]> = {
    '新生儿期（0-28天）': [],
    '婴儿期（1-12月）': [],
    '幼儿期（1-3岁）': [],
    '学龄前（3-6岁）': [],
    '学龄期（6岁以上）': []
  };
  
  schedule.forEach(item => {
    if (item.ageInMonths === 0) {
      grouped['新生儿期（0-28天）'].push(item);
    } else if (item.ageInMonths > 0 && item.ageInMonths <= 12) {
      grouped['婴儿期（1-12月）'].push(item);
    } else if (item.ageInMonths > 12 && item.ageInMonths <= 36) {
      grouped['幼儿期（1-3岁）'].push(item);
    } else if (item.ageInMonths > 36 && item.ageInMonths <= 72) {
      grouped['学龄前（3-6岁）'].push(item);
    } else {
      grouped['学龄期（6岁以上）'].push(item);
    }
  });
  
  return grouped;
};
