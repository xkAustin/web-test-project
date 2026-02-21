#!/bin/bash

# 测试报告生成脚本
# 此脚本在测试完成后生成可视化报告和统计信息

set -e

echo "================================"
echo "  Playwright 测试报告生成"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查报告文件是否存在
if [ ! -f "reports/test-results.json" ]; then
  echo -e "${RED}✗ 找不到测试结果文件: reports/test-results.json${NC}"
  echo "请先运行: npm test"
  exit 1
fi

echo -e "${BLUE}📊 正在解析测试结果...${NC}"
echo ""

# 使用 Node.js 解析 JSON 并生成统计信息
node << 'EOF'
const fs = require('fs');
const path = require('path');

try {
  const resultsFile = path.join(process.cwd(), 'reports', 'test-results.json');
  const data = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

  // 统计数据
  const stats = data.stats || {};
  const totalTests = stats.expected || 0;
  const expectedFails = stats.expected || 0;
  const unexpected = stats.unexpected || 0;
  const skipped = stats.skipped || 0;
  const duration = stats.duration || 0;

  const passed = totalTests - unexpected - skipped;
  const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) : 0;

  console.log('📈 测试执行统计');
  console.log('━'.repeat(40));
  console.log(`总测试数:     ${totalTests}`);
  console.log(`✓ 通过:       ${passed} (${passRate}%)`);
  console.log(`✗ 失败:       ${unexpected}`);
  console.log(`⊘ 跳过:       ${skipped}`);
  console.log(`⏱  总耗时:     ${(duration / 1000).toFixed(2)}s`);
  console.log('━'.repeat(40));
  console.log('');

  // 按测试结果分类
  if (data.suites && data.suites.length > 0) {
    let suiteStats = {};

    data.suites.forEach(suite => {
      if (suite.tests) {
        suite.tests.forEach(test => {
          const title = suite.title || 'Unknown';
          if (!suiteStats[title]) {
            suiteStats[title] = { pass: 0, fail: 0, skip: 0 };
          }

          if (test.status === 'passed') {
            suiteStats[title].pass++;
          } else if (test.status === 'failed') {
            suiteStats[title].fail++;
          } else if (test.status === 'skipped') {
            suiteStats[title].skip++;
          }
        });
      }
    });

    console.log('📁 按测试套件');
    console.log('━'.repeat(40));
    Object.entries(suiteStats).forEach(([suite, counts]) => {
      const total = counts.pass + counts.fail + counts.skip;
      const rate = total > 0 ? ((counts.pass / total) * 100).toFixed(0) : 0;
      console.log(`${suite}`);
      console.log(`  ✓ ${counts.pass}  ✗ ${counts.fail}  ⊘ ${counts.skip}  (${rate}%)`);
    });
  }

  console.log('');
  console.log('📄 HTML 报告已生成到: reports/html/index.html');
  console.log('运行 npm run test:report 来查看详细报告');

} catch (error) {
  console.error('Error parsing test results:', error.message);
  process.exit(1);
}
EOF

echo ""
echo -e "${GREEN}✓ 报告生成完成${NC}"
echo ""
echo "查看完整报告，请运行:"
echo -e "${YELLOW}  npm run test:report${NC}"
