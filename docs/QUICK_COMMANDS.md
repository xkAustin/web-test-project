# 快速命令速查表

## 📚 快速开始

```bash
# 1. 安装依赖
npm ci
npx playwright install --with-deps

# 2. 配置环境
cp .env.example .env
# 编辑 .env，添加 TEST_USERNAME 和 TEST_PASSWORD

# 3. 验证环境
bash scripts/check-env.sh

# 4. 首次运行测试
npm run test:ui
```

---

## 🧪 测试命令

### 所有测试
```bash
npm test                                # 运行所有测试
npm test -- --headed                    # 有头浏览器显示
npm test -- --debug                     # 调试模式
npm test -- --workers=1                 # 单线程执行
npm test -- -g "pattern"                # 按名称过滤
```

### 特定测试套件
```bash
npm run test:e2e                         # E2E 测试
npm run test:api                         # API 测试
npm run test:security                    # 安全测试
npm run test:performance                 # 性能测试
npm run test:accessibility               # 可访问性测试
```

### 特定测试文件
```bash
npx playwright test tests/e2e/home.spec.ts
npx playwright test tests/api/
```

### 浏览器选择
```bash
npm run test:chromium                    # Chrome 桌面
npm run test:firefox                     # Firefox 桌面
npm run test:webkit                      # Safari 桌面
npm run test:mobile                      # 移动浏览器
```

### UI 模式（推荐开发使用）
```bash
npm run test:ui                          # 启动 UI 模式
npm run test:ui -- tests/e2e/home.spec.ts  # 特定文件
```

### 调试和故障排除
```bash
npm run test:debug                       # 启用调试模式
npm run test:failed                      # 仅运行失败的测试
npm run test:report                      # 查看 HTML 报告
PWDEBUG=1 npm test                       # Playwright Inspector
```

---

## 📊 报告和覆盖

```bash
npm run test:report                      # 查看 HTML 报告
npm run coverage                         # 代码覆盖率报告
bash scripts/generate-report.sh          # 生成文本报告
```

---

## 💻 代码质量

```bash
npm run lint                             # 运行 ESLint
npm run lint:fix                         # 自动修复
npm run format                           # 代码格式化
npm run format:check                     # 检查格式
```

---

## 🐳 Docker

```bash
# 构建镜像
docker build -t wangdanatest-automation .

# 运行容器
docker run --rm -v $(pwd):/app -w /app wangdanatest-automation npm test

# 交互式 Shell
docker run --rm -v $(pwd):/app -w /app -it mcr.microsoft.com/playwright:v1.43.0-jammy bash
```

---

## 🔧 环境和工具

```bash
# 检查环境
bash scripts/check-env.sh
bash scripts/check-env.sh --verbose      # 详细模式

# 安装浏览器驱动
npx playwright install --with-deps
npx playwright install chromium firefox webkit

# 清理环境
npm run clean                            # 删除 reports, coverage 等
npm run clean:browsers                   # 重新安装浏览器
```

---

## 📦 依赖管理

```bash
# 安装依赖
npm ci                                   # 精确安装（推荐用于 CI/CD）
npm install                              # 灵活安装

# 更新依赖
npm update
npm outdated                             # 查看过期包

# 安全审计
npm audit                                # 检查安全问题
npm audit fix                            # 自动修复
```

---

## 🌍 持续集成

```bash
# GitHub Actions 工作流触发条件：
# 1. 推送到 main/develop 分支
# 2. 创建 Pull Request
# 3. 每天 UTC 1:00 定时运行

# 本地模拟 CI 环境
CI=true npm test                         # 模拟 CI 环境运行
CI=true npm test -- --workers=1          # CI 环境单线程
```

---

## 📝 项目管理

```bash
# 查看项目统计
find tests -name "*.spec.ts" | wc -l     # 测试文件数
grep -r "test(" tests/ | wc -l           # 测试用例数
cloc tests/                              # 代码统计（需要 cloc）

# 生成项目树
tree -L 3 -I 'node_modules'

# 查看文件大小
du -sh docs/ tests/ reports/
```

---

## 🐛 常见问题命令

```bash
# 问题：找不到浏览器
npx playwright install --with-deps

# 问题：端口被占用
lsof -i :3000
kill -9 <PID>

# 问题：清除缓存
rm -rf node_modules package-lock.json
npm ci

# 问题：权限问题
chmod +x scripts/*.sh
```

---

## 🔗 有用的快捷方式

```bash
# 创建别名（加入 ~/.bashrc 或 ~/.zshrc）
alias test-ui='npm run test:ui'
alias test-debug='npm run test:debug'
alias test-all='npm test'

# 快速脚本
# 运行并查看报告
npm test && npm run test:report

# 运行所有检查
npm run lint && npm run format && npm test
```

---

## 📖 文档链接

| 文档 | 命令查看 |
|------|--------|
| 完整文档 | `open docs/` |
| 测试计划 | `open docs/test_plan/TEST_PLAN.md` |
| 执行指南 | `open docs/guidelines/TESTING_GUIDE.md` |
| 项目结构 | `open docs/PROJECT_STRUCTURE.md` |

---

## 💡 Pro 技巧

```bash
# 只运行最近修改的文件
git diff HEAD --name-only | grep -E '\.spec\.ts$' | xargs npx playwright test

# 并行运行多个浏览器
npm test -- --workers=4

# 生成测试覆盖率报告
npm run coverage

# 查看具体测试用例列表
npx playwright test --list

# 运行特定优先级的测试
npx playwright test -g "@high"
```

---

## 📞 获取帮助

```bash
# 查看所有命令
npm run

# Playwright 帮助
npx playwright test --help

# 查看本项目的 package.json 脚本
cat package.json | grep -A 20 '"scripts"'
```

---

**版本**: 1.0.0
**最后更新**: 2026-02-21

