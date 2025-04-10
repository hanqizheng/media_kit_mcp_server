import { deepseekClient } from "../helper/deepseek.js";

const sampleMediaKit = `
# Sample Media Kit

## Audience Demographics
Our platform reaches primarily young professionals aged 25-35, with a 60% female audience. Most of our users are based in major cities across Germany.

## Platform Statistics
- Monthly Visitors: 250K
- Instagram Followers: 100K
- Newsletter Subscribers: 45K

## Advertising Packages
1. Basic Package
   - 1 Instagram Post
   - 1 Blog Post
   - Price: €500

2. Premium Package
   - 3 Instagram Posts
   - 2 Blog Posts
   - 1 Newsletter Feature
   - Price: €1,200

3. Enterprise Package
   - Custom Campaign
   - Full Platform Access
   - Price: Contact Us
`;

async function testComprehensiveAnalysis() {
  try {
    console.error("开始分析媒体资料包...\n");

    const analysis = await deepseekClient.analyzeComprehensive(sampleMediaKit);

    console.error(JSON.stringify(analysis, null, 2));
  } catch (error) {
    console.error("分析过程中出现错误:", error);
  }
}

testComprehensiveAnalysis();
