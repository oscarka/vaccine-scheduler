// 疫苗数据类型定义
export interface Vaccine {
  id: string;
  name: string;
  englishAbbr: string;
  disease: string;
  route: string;
  dose: string;
  scheduleAges: number[]; // 月龄，特殊情况：0表示出生时
  description: string;
  notes: string;
  isNIP: boolean; // 是否为国家免疫规划疫苗
  manufacturer?: string; // 厂商，非免疫规划疫苗可能需要
}

// 国家免疫规划疫苗数据（2021年版 + 2025年百白破调整）
export const nipVaccines: Vaccine[] = [
  {
    id: "hepb",
    name: "乙肝疫苗",
    englishAbbr: "HepB",
    disease: "乙型病毒性肝炎",
    route: "肌内注射",
    dose: "10或20μg",
    scheduleAges: [0, 1, 6], // 出生时、1月龄、6月龄
    description: "预防乙型病毒性肝炎",
    notes: "第1剂应在出生后24小时内完成",
    isNIP: true
  },
  {
    id: "bcg",
    name: "卡介苗",
    englishAbbr: "BCG",
    disease: "结核病",
    route: "皮内注射",
    dose: "0.1ml",
    scheduleAges: [0], // 出生时
    description: "预防结核性脑膜炎、粟粒性肺结核等",
    notes: "应在3月龄前完成",
    isNIP: true
  },
  {
    id: "ipv",
    name: "脊灰灭活疫苗",
    englishAbbr: "IPV",
    disease: "脊髓灰质炎",
    route: "肌内注射",
    dose: "0.5ml",
    scheduleAges: [2, 4], // 2月龄、4月龄
    description: "预防脊髓灰质炎",
    notes: "",
    isNIP: true
  },
  {
    id: "bopv",
    name: "脊灰减毒活疫苗",
    englishAbbr: "bOPV",
    disease: "脊髓灰质炎",
    route: "口服",
    dose: "1粒或2滴",
    scheduleAges: [4, 6], // 4月龄、6月龄
    description: "预防脊髓灰质炎",
    notes: "第4剂应在5周岁前完成",
    isNIP: true
  },
  {
    id: "dtap",
    name: "百白破疫苗",
    englishAbbr: "DTaP",
    disease: "百日咳、白喉、破伤风",
    route: "肌内注射",
    dose: "0.5ml",
    scheduleAges: [2, 4, 6, 18, 72], // 2月龄、4月龄、6月龄、18月龄、6周岁(72月龄)
    description: "预防百日咳、白喉、破伤风",
    notes: "2025年1月1日起调整为5剂次百白破疫苗",
    isNIP: true
  },
  {
    id: "mmr",
    name: "麻腮风疫苗",
    englishAbbr: "MMR",
    disease: "麻疹、风疹、流行性腮腺炎",
    route: "皮下注射",
    dose: "0.5ml",
    scheduleAges: [8, 18], // 8月龄、18月龄
    description: "预防麻疹、风疹、流行性腮腺炎",
    notes: "第1剂应在12月龄前完成，第2剂应在24月龄前完成",
    isNIP: true
  },
  {
    id: "je-l",
    name: "乙脑减毒活疫苗",
    englishAbbr: "JE-L",
    disease: "流行性乙型脑炎",
    route: "皮下注射",
    dose: "0.5ml",
    scheduleAges: [8, 24], // 8月龄、2岁
    description: "预防流行性乙型脑炎",
    notes: "两剂次接种程序",
    isNIP: true
  },
  {
    id: "je-i",
    name: "乙脑灭活疫苗",
    englishAbbr: "JE-I",
    disease: "流行性乙型脑炎",
    route: "肌内注射",
    dose: "0.5ml",
    scheduleAges: [8, 8.25, 24, 72], // 8月龄（1、2剂，间隔7-10天）、2岁、6岁
    description: "预防流行性乙型脑炎",
    notes: "四剂次接种程序；第1、2剂间隔7-10天",
    isNIP: true
  },
  {
    id: "mpsv-a",
    name: "A群流脑多糖疫苗",
    englishAbbr: "MPSV-A",
    disease: "流行性脑脊髓膜炎",
    route: "皮下注射",
    dose: "0.5ml",
    scheduleAges: [6, 36], // 6-18月龄、3岁
    description: "预防A群流行性脑脊髓膜炎",
    notes: "第2剂应在18月龄前完成",
    isNIP: true
  },
  {
    id: "mpsv-ac",
    name: "A群C群流脑多糖疫苗",
    englishAbbr: "MPSV-AC",
    disease: "流行性脑脊髓膜炎",
    route: "皮下注射",
    dose: "0.5ml",
    scheduleAges: [36, 72], // 3岁、6岁
    description: "预防A群和C群流行性脑脊髓膜炎",
    notes: "第1剂应在4周岁前完成，第2剂应在7周岁前完成",
    isNIP: true
  },
  {
    id: "hepa-l",
    name: "甲肝减毒活疫苗",
    englishAbbr: "HepA-L",
    disease: "甲型病毒性肝炎",
    route: "皮下注射",
    dose: "0.5或1.0ml",
    scheduleAges: [18], // 18-24月龄
    description: "预防甲型病毒性肝炎",
    notes: "一剂次接种程序",
    isNIP: true
  },
  {
    id: "hepa-i",
    name: "甲肝灭活疫苗",
    englishAbbr: "HepA-I",
    disease: "甲型病毒性肝炎",
    route: "肌内注射",
    dose: "0.5ml",
    scheduleAges: [18, 24], // 18-24月龄、2-3岁
    description: "预防甲型病毒性肝炎",
    notes: "两剂次接种程序",
    isNIP: true
  }
];

// 非免疫规划疫苗数据
export const nonNipVaccines: Vaccine[] = [
  {
    id: "pcv13",
    name: "13价肺炎球菌多糖结合疫苗",
    englishAbbr: "PCV13",
    disease: "肺炎球菌感染",
    route: "肌内注射",
    dose: "0.5ml",
    scheduleAges: [2, 4, 6, 12], // 2月龄、4月龄、6月龄、12-15月龄
    description: "预防由肺炎球菌血清型1、3、4、5、6A、6B、7F、9V、14、18C、19A、19F和23F引起的侵袭性疾病",
    notes: "首选部位婴儿为大腿前外侧，幼儿和儿童为上臂三角肌",
    isNIP: false,
    manufacturer: "辉瑞"
  },
  {
    id: "dtap-ipv-hib",
    name: "五联疫苗",
    englishAbbr: "DTaP-IPV/Hib",
    disease: "百日咳、白喉、破伤风、脊髓灰质炎、b型流感嗜血杆菌感染",
    route: "肌内注射",
    dose: "0.5ml",
    scheduleAges: [2, 4, 6, 18], // 2月龄、4月龄、6月龄、18月龄
    description: "预防百日咳、白喉、破伤风、脊髓灰质炎和b型流感嗜血杆菌引起的侵袭性疾病",
    notes: "全程共需接种4剂次",
    isNIP: false,
    manufacturer: "某厂商"
  },
  {
    id: "mpsv-acyw135",
    name: "ACYW135群脑膜炎球菌多糖疫苗",
    englishAbbr: "MPSV-ACYW135",
    disease: "流行性脑脊髓膜炎",
    route: "肌内注射或皮下注射",
    dose: "0.5ml",
    scheduleAges: [24], // 2周岁以上（高危人群）
    description: "预防A、C、Y、W135群脑膜炎球菌引起的流行性脑脊髓膜炎",
    notes: "适用于旅游到或居住在高危地区者、实验室工作人员等高危人群",
    isNIP: false,
    manufacturer: "智飞生物"
  },
  {
    id: "rv",
    name: "轮状病毒疫苗",
    englishAbbr: "RV",
    disease: "轮状病毒感染",
    route: "口服",
    dose: "按说明书",
    scheduleAges: [2], // 2月龄开始
    description: "预防轮状病毒引起的腹泻",
    notes: "第一剂必须在15周大前接种，最后一剂必须在8个月大前接种",
    isNIP: false,
    manufacturer: "兰州生物制品研究所"
  },
  {
    id: "iiv",
    name: "流感疫苗",
    englishAbbr: "IIV",
    disease: "流行性感冒",
    route: "肌内注射",
    dose: "0.5ml",
    scheduleAges: [6], // 6月龄及以上
    description: "预防流感病毒引起的流行性感冒",
    notes: "每年接种，6月龄-8岁首次接种需2剂，间隔≥4周",
    isNIP: false,
    manufacturer: "多厂家"
  }
];

// 接种原则与注意事项
export const vaccinationPrinciples = [
  {
    id: "simultaneous",
    title: "同时接种原则",
    content: [
      "不同疫苗同时接种：两种及以上注射类疫苗应在不同部位接种，严禁将两种或多种疫苗混合吸入同一支注射器内接种。",
      "现阶段的国家免疫规划疫苗均可按照免疫程序或补种原则同时接种。",
      "不同疫苗接种间隔：两种及以上注射类减毒活疫苗如果未同时接种，应间隔不小于28天进行接种。"
    ]
  },
  {
    id: "supplementary",
    title: "补种原则",
    content: [
      "未按照推荐年龄完成国家免疫规划规定剂次接种的小于18周岁儿童，应尽早补种。",
      "对未曾接种某种免疫规划疫苗的儿童，根据儿童当时的年（月）龄，按照该疫苗的免疫程序进行补种。"
    ]
  },
  {
    id: "priority",
    title: "优先接种原则",
    content: [
      "免疫规划疫苗和非免疫规划疫苗接种时间相同但未同时接种的，应优先接种免疫规划疫苗或者受种方自主选择的含免疫规划疫苗成分的非免疫规划疫苗。",
      "特殊情况下，应优先接种预防紧急疾病风险的非免疫规划疫苗(如人用狂犬病疫苗、破伤风疫苗或其他需紧急接种的疫苗)。"
    ]
  },
  {
    id: "site",
    title: "接种部位",
    content: [
      "疫苗接种途径通常为口服、肌内注射、皮下注射和皮内注射。",
      "注射部位通常为上臂外侧三角肌处和大腿前外侧中部。",
      "当多种疫苗同时注射接种（包括肌内、皮下和皮内注射）时，可在左右上臂、左右大腿分别接种，卡介苗选择上臂。"
    ]
  },
  {
    id: "special",
    title: "特殊健康状态儿童接种注意事项",
    content: [
      "早产儿、低出生体重儿：按照实际月龄接种疫苗，不需要校正胎龄。",
      "慢性疾病儿童：稳定期可接种疫苗，急性发作期应暂缓接种。",
      "免疫功能低下儿童：应避免接种减毒活疫苗，可接种灭活疫苗。"
    ]
  }
];

// 获取所有疫苗数据
export const getAllVaccines = (): Vaccine[] => {
  return [...nipVaccines, ...nonNipVaccines];
};

// 根据ID获取疫苗
export const getVaccineById = (id: string): Vaccine | undefined => {
  return getAllVaccines().find(vaccine => vaccine.id === id);
};

// 根据月龄获取应接种的疫苗
export const getVaccinesByAge = (ageInMonths: number): Vaccine[] => {
  return getAllVaccines().filter(vaccine =>
    vaccine.scheduleAges.some(age => Math.abs(age - ageInMonths) < 0.5)
  );
};
