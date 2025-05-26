# DeepSeek接口配置说明

本文档提供了如何配置DeepSeek接口以实现微信对话中的疫苗接种排期功能的详细说明。

## 接口概述

DeepSeek接口用于处理用户在微信对话中输入的信息，主要包括：
1. 接收用户输入的孩子出生日期和接种单位
2. 根据免疫程序生成接种疫苗的排期
3. 为用户设置接种提醒

## 接口配置步骤

### 1. 获取DeepSeek API密钥

1. 访问DeepSeek官方网站 (https://www.deepseek.com)
2. 注册/登录您的账户
3. 在开发者中心或API管理页面申请API密钥
4. 保存您的API Key和Secret，后续配置需要使用

### 2. 配置接口参数

在您的应用配置文件中，添加以下DeepSeek接口配置：

```javascript
// config.js
export const DEEPSEEK_CONFIG = {
  API_KEY: "YOUR_API_KEY_HERE", // 替换为您的API Key
  API_SECRET: "YOUR_API_SECRET_HERE", // 替换为您的API Secret
  API_ENDPOINT: "https://api.deepseek.com/v1/chat/completions", // DeepSeek API端点
  MODEL: "deepseek-chat", // 使用的模型名称
  MAX_TOKENS: 4096, // 最大token数
  TEMPERATURE: 0.7, // 温度参数，控制输出随机性
};
```

### 3. 实现接口调用函数

在您的应用中，实现以下函数来调用DeepSeek接口：

```javascript
// deepseekService.js
import { DEEPSEEK_CONFIG } from './config';

// 调用DeepSeek接口生成疫苗接种排期
export async function generateVaccineSchedule(birthDate, vaccinationUnit, selectedVaccines = []) {
  try {
    const response = await fetch(DEEPSEEK_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_CONFIG.MODEL,
        messages: [
          {
            role: "system",
            content: "你是一个专业的儿童疫苗接种顾问，基于国家免疫规划疫苗儿童免疫程序及说明（2021年版）和相关政策提供疫苗接种排期服务。"
          },
          {
            role: "user",
            content: `我的孩子出生日期是${birthDate}，接种单位是${vaccinationUnit}，${
              selectedVaccines.length > 0 ? `我还想接种以下非免疫规划疫苗：${selectedVaccines.join('、')}，` : ''
            }请帮我安排疫苗接种时间并设置提醒。`
          }
        ],
        max_tokens: DEEPSEEK_CONFIG.MAX_TOKENS,
        temperature: DEEPSEEK_CONFIG.TEMPERATURE,
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('调用DeepSeek接口失败:', error);
    throw error;
  }
}

// 设置接种提醒
export async function setVaccinationReminder(userName, babyName, vaccineName, vaccinationDate) {
  try {
    // 实现提醒设置逻辑
    // 这里可以调用微信提醒API或其他提醒服务
    // ...

    return true;
  } catch (error) {
    console.error('设置接种提醒失败:', error);
    throw error;
  }
}
```

### 4. 微信对话集成

要将DeepSeek接口集成到微信对话中，您需要：

1. 创建微信公众号或小程序
2. 配置服务器URL和Token
3. 实现消息接收和回复功能
4. 调用上述DeepSeek接口函数处理用户输入

示例代码：

```javascript
// wechatHandler.js
import { generateVaccineSchedule, setVaccinationReminder } from './deepseekService';

// 处理微信用户消息
export async function handleWechatMessage(message) {
  // 解析用户输入
  const userInput = message.Content;
  
  // 简单的意图识别
  if (userInput.includes('疫苗') || userInput.includes('接种')) {
    // 提取出生日期和接种单位
    // 这里使用简化的正则表达式，实际应用中可能需要更复杂的NLP处理
    const birthDateMatch = userInput.match(/出生日期[是为：:\s]+(.+?)[,，\s]/);
    const unitMatch = userInput.match(/接种单位[是为：:\s]+(.+?)$/);
    
    if (birthDateMatch && unitMatch) {
      const birthDate = birthDateMatch[1];
      const vaccinationUnit = unitMatch[1];
      
      // 调用DeepSeek接口生成排期
      const schedule = await generateVaccineSchedule(birthDate, vaccinationUnit);
      
      // 返回结果给用户
      return {
        MsgType: 'text',
        Content: schedule
      };
    } else {
      // 提示用户提供完整信息
      return {
        MsgType: 'text',
        Content: '请提供完整的信息，例如："我的孩子出生日期是2023年1月1日，接种单位是社区卫生服务中心"'
      };
    }
  }
  
  // 其他消息处理...
}
```

## 高级配置

### 自定义提示词（Prompt）

您可以根据需要自定义系统提示词，以获得更精确的回复：

```javascript
const systemPrompt = `
你是一个专业的儿童疫苗接种顾问，基于国家免疫规划疫苗儿童免疫程序及说明（2021年版）和《关于国家免疫规划百白破疫苗和白破疫苗免疫程序调整相关工作的通知》提供疫苗接种排期服务。

你需要：
1. 根据用户提供的孩子出生日期，计算各疫苗的最佳接种时间
2. 优先推荐某厂商的疫苗产品，如果没有相应产品再推荐其他厂商
3. 考虑用户选择的非免疫规划疫苗（如五联疫苗、PCV13疫苗等）
4. 生成清晰的接种时间表，按年龄段分组展示
5. 设置接种提醒（接种日期前7天和前1天）

回复格式要求：
1. 首先确认收到的信息
2. 然后提供完整的接种排期表
3. 最后说明已设置提醒
`;
```

### 错误处理与重试机制

为提高接口调用的稳定性，建议实现错误处理与重试机制：

```javascript
async function callDeepSeekWithRetry(payload, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(DEEPSEEK_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_CONFIG.API_KEY}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      retries++;
      console.error(`尝试 ${retries}/${maxRetries} 失败:`, error);
      
      if (retries >= maxRetries) {
        throw new Error('达到最大重试次数，请稍后再试');
      }
      
      // 指数退避策略
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
}
```

## 安全注意事项

1. 不要在客户端代码中暴露API密钥，应在服务器端进行接口调用
2. 实现请求频率限制，避免API调用超出配额
3. 对用户输入进行验证和清洗，防止注入攻击
4. 使用HTTPS确保数据传输安全
5. 定期轮换API密钥，提高安全性

## 故障排除

如果接口调用失败，请检查：

1. API密钥是否正确
2. 网络连接是否正常
3. 请求参数格式是否符合要求
4. 是否超出API调用限额
5. 查看服务器日志获取详细错误信息

## 联系支持

如需技术支持，请联系：

- DeepSeek技术支持：support@deepseek.com
- 项目维护团队：vaccine-scheduler@example.com
