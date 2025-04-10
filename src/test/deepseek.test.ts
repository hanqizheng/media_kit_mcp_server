import { deepseekClient } from "../helper/deepseek.js";

async function testDeepSeekAPI() {
  try {
    const response = await deepseekClient.testDeepSeekAPI();

    console.error("API Response:");
    console.error("Content:", response.choices[0].message.content);
    console.error("Full Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error testing DeepSeek API:", error);
  }
}

console.error("Starting DeepSeek API test...");
testDeepSeekAPI();
