# wangdanatest.top 自动化测试项目

![CI Status](https://github.com/your-username/test-project/actions/workflows/test.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-%3E%3D18.0.0-brightgreen)

<div align="center">

**企业级 Playwright 自动化测试框架**

完整的测试解决方案，用于测试 [wangdanatest.top](https://www.wangdanatest.top) - 软件测试技术交流论坛

[📖 文档](#文档) • [🚀 快速开始](#快速开始) • [📂 结构](#项目结构) • [🤝 贡献](CONTRIBUTING.md)

</div>

---

## ✨ 核心特性

- ✅ **80+ 测试用例** - 5 种测试类型完全覆盖
- ✅ **多浏览器支持** - Chrome, Firefox, Safari, 移动浏览器
- ✅ **Page Object Model** - 高效的代码架构
- ✅ **完整文档体系** - 80,000+ 字详细文档
- ✅ **自动化 CI/CD** - GitHub Actions 完整工作流
- ✅ **开箱即用** - 快速上手，最小化学习曲线

---

## 📊 快览

| 指标 | 数值 |
|------|------|
| 测试用例 | 80+ |
| 测试文件 | 12 |
| 页面对象 | 4 |
| 浏览器 | 5 |
| 文档页数 | 80+ |

---

## 🚀 快速开始

###  1️⃣ 安装依赖

```bash
npm ci
npx playwright install --with-deps
```

### 2️⃣ 配置环境

```bash
cp .env.example .env
# 编辑.env, 添加测试凭证
```

### 3️⃣ 验证并运行

```bash
bash scripts/check-env.sh      # 环境检查
npm test                        # 运行所有测试
npm run test:ui                 # UI交互模式（推荐）
```

---

## 📂 项目结构

```
test-project/
├── 📋 根目录配置
│   ├── README.md              # 本文件（快速入门）
│   ├── CONTRIBUTING.md        # 贡献指南
│   ├── package.json           # 项目配置
│   ├── playwright.config.ts   # Playwright 配置
│   ├── .env.example           # 环境变量示例
│   └── Dockerfile             # Docker 配置
│
├── 📚 docs/                    # 完整文档（80+ 页）
│   ├── PROJECT_COMPLETION_SUMMARY.md  # 项目完成总结
│   ├── PROJECT_STRUCTURE.md    # 文件结构说明
│   ├── test_plan/             # 测试计划
│   ├── guidelines/            # 执行指南
│   └── reports/               # 报告模板
│
├── 🧪 tests/                   # 测试代码（80+ 用例）
│   ├── e2e/                   # 端到端测试
│   ├── api/                   # API 测试
│   ├── security/              # 安全测试
│   ├── performance/           # 性能测试
│   ├── pages/                 # 页面对象（4 个）
│   └── utils/                 # 工具函数
│
├── 📜 scripts/                 # 自动化脚本
│   ├── check-env.sh           # 环境检查
│   └── generate-report.sh     # 报告生成
│
├── ⚙️ config/                  # 配置文件
│
└── 📁 .github/workflows/       # CI/CD 工作流
    ├── test.yml               # 测试执行
    └── ci.yml                 # 代码质量检查
```

---

## 📖 文档导航

| 文档 | 说明 |
|------|------|
| [PROJECT_COMPLETION_SUMMARY.md](docs/PROJECT_COMPLETION_SUMMARY.md) | 📋 项目完成情况 |
| [TEST_PLAN.md](docs/test_plan/TEST_PLAN.md) | 📝 所有测试用例 |
| [TESTING_GUIDE.md](docs/guidelines/TESTING_GUIDE.md) | 🚀 快速执行指南 |
| [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | 🏗️ 文件结构说明 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 🤝 贡献指南 |

---

## 🧪 测试类型

### E2E 测试（40+ 用例）
验证用户完整业务流程
```bash
npm run test:e2e
```

### API 测试（10+ 用例）
验证后端接口可靠性
```bash
npm run test:api
```

### 安全测试（35+ 用例）
实施 XSS、CSRF、可访问性验证
```bash
npm run test:security
```

### 性能测试（15+ 用例）
监控关键性能指标
```bash
npm run test:performance
```

### 兼容性测试
多浏览器、多设备验证
```bash
npm run test:mobile
```

---

## 💻 常用命令

```bash
# 基本命令
npm test                  # 所有测试
npm run test:ui          # UI 交互模式
npm run test:debug       # 调试模式

# 特定浏览器
npm run test:chromium    # Chrome
npm run test:firefox     # Firefox
npm run test:webkit      # Safari

# 特定套件
npm run test:e2e         # E2E 测试
npm run test:api         # API 测试
npm run test:security    # 安全测试

# 报告
npm run test:report      # 查看 HTML 报告
npm run coverage         # 覆盖率报告

# 代码质量
npm run lint             # 代码检查
npm run format           # 代码格式化
```

---

## 🐳 Docker 运行

```bash
docker build -t wangdanatest-automation .
docker run --rm -v $(pwd):/app -w /app wangdanatest-automation npm test
```

---

## 📈 持续集成

项目已配置 GitHub Actions：

- ✅ 自动测试执行
- ✅ 多 Node 版本测试
- ✅ 安全审计检查
- ✅ 代码质量分析
- ✅ 自动报告生成

**配置**:
1. 添加 GitHub Secrets: `TEST_USERNAME`, `TEST_PASSWORD`
2. 推送到 main/develop 分支自动触发
3. 每天 UTC 1:00 定时运行

---

## 🎯 测试覆盖

### 功能模块
- 🏠 首页加载、导航、内容
- 🔐 用户认证、登录、凭证验证
- 🔍 搜索功能、结果展示、分页
- 💬 论坛交互、讨论、标签、分类
- 🔌 API 端点、响应、性能

### 安全防护
- ⚔️ XSS 保护
- 🛡️ CSRF 保护
- ♿ WCAG 2.0 AA 可访问性

### 其他
- ⚡ 性能指标监控
- 📱 跨平台兼容性
- 📊 多浏览器支持

---

## 🐛 故障排除

**找不到元素?** → 查看 [TESTING_GUIDE.md](docs/guidelines/TESTING_GUIDE.md#故障排除)

**网络超时?** → 检查连接或 [查看解决方案](docs/guidelines/TESTING_GUIDE.md#问题-2-网络请求超时)

**凭证错误?** → 检查 `.env` 文件配置

**测试失败?** → 运行 `npm run test:debug` 调试

---

## 🏁 第一次使用？

1. 📖 阅读本文件的"快速开始"
2. 🔍 查看 [TESTING_GUIDE.md](docs/guidelines/TESTING_GUIDE.md)
3. ▶️ 运行 `npm run test:ui` 查看演示
4. 📋 查看 [TEST_PLAN.md](docs/test_plan/TEST_PLAN.md) 了解所有用例

---

## 🤝 贡献

欢迎贡献！查看 [CONTRIBUTING.md](CONTRIBUTING.md) 获取详情

### 快速流程
```bash
git checkout -b feature/your-feature
# 编码...
git commit -m 'feat: add amazing feature'
git push origin feature/your-feature
# 创建 Pull Request
```

---

## 📞 获取帮助

- 🐛 报告问题: [GitHub Issues](https://github.com/your-username/test-project/issues)
- 💬 讨论方案: [GitHub Discussions](https://github.com/your-username/test-project/discussions)
- 📧 联系团队: qa-team@example.com

---

## 📜 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🙏 致谢

感谢所有贡献者和使用者！

---

<div align="center">

**立即开始** 🚀

[文档](docs/) • [问题](https://github.com/your-username/test-project/issues) • [讨论](https://github.com/your-username/test-project/discussions)

</div>

---

**版本**: 1.0.0 | **更新**: 2026-02-21 | **维护**: QA Team
