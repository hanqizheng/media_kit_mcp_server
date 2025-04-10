import OpenAI from "openai";
import { DEEP_SEEK_BASE_URL } from "../constant.js";

interface MediaKitAnalysis {
  target_audience?: {
    gender?: string;
    age_ranges?: string[];
    geography?: string;
  };
  advertising_options?: Array<{
    type: string;
    price: string;
    details?: string;
  }>;
  platform_reach?: {
    monthly_visitors?: string;
    social_followers?: string;
    email_subscribers?: string;
  };
}

interface ComprehensiveAnalysis {
  basicInfo: {
    audience: {
      gender: string;
      age: string[];
      location: string;
    };
    reach: {
      visitors: string;
      social: string;
      email: string;
    };
    packages: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  analysis: {
    advantages: string[];
    risks: string[];
    suggestions: string[];
  };
}

export class DeepSeekClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: DEEP_SEEK_BASE_URL,
      apiKey: apiKey,
    });
  }

  async testDeepSeekAPI() {
    const response = await this.client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Hello!" }],
    });
    return response;
  }

  async analyzeComprehensive(content: string): Promise<ComprehensiveAnalysis> {
    try {
      const systemPrompt = `你是一个专业的媒体投放分析专家。请分析提供的媒体资料包(Media Kit)，并按以下JSON格式输出分析结果：

{
  "basicInfo": {
    "audience": {
      "gender": "受众性别分布",
      "age": ["主要年龄段1", "主要年龄段2"],
      "location": "主要地理位置"
    },
    "reach": {
      "visitors": "月访问量",
      "social": "社交媒体粉丝数",
      "email": "邮件订阅用户数"
    },
    "packages": [
      {
        "name": "套餐名称",
        "price": "价格",
        "features": ["功能1", "功能2"]
      }
    ]
  },
  "analysis": {
    "advantages": ["优势1", "优势2", "优势3"],
    "risks": ["风险1", "风险2"],
    "suggestions": ["建议1", "建议2"]
  }
}

注意事项：
1. 保持原始数字单位（K、M等）
2. 所有文本必须用中文输出
3. 如信息缺失则返回null
4. 优势、风险、建议各控制在3点以内
5. 确保输出为有效的JSON格式`;

      const response = await this.client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `请分析以下媒体资料包内容：\n\n${content}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const result = response.choices[0].message.content || "{}";
      return JSON.parse(result);
    } catch (error) {
      console.error("Error in comprehensive analysis:", error);
      throw error;
    }
  }
}

// 创建单例实例
export const deepseekClient = new DeepSeekClient(
  process.env.DEEP_SEEK_API_KEY || ""
);
