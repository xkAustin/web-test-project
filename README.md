# wangdanatest.top 自动化测试项目

![CI Status](https://github.com/your-username/test-project/actions/workflows/test.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-%3E%3D18.0.0-brightgreen)

完整的 **Playwright** 自动化测试项目，用于测试 [wangdanatest.top](https://www.wangdanatest.top) 网站。本项目遵循工程级最佳实践，覆盖功能测试、API 测试、安全测试、性能测试、兼容性测试和可访问性测试。

## 📋 目录

- [项目概述](#项目概述)
- [快速启动](#快速启动)
- [项目结构](#项目结构)
- [测试类型](#测试类型)
- [配置和环境](#配置和环境)
- [运行测试](#运行测试)
- [持续集成](#持续集成)
- [文档](#文档)
- [提交问题](#提交问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目概述

### 核心特性

✅ **完整的自动化测试覆盖**
- 端到端 (E2E) 功能测试
- RESTful API 测试
- 安全防护验证 (XSS, CSRF)
- 性能基准测试
- WCAG 可访问性合规检查

✅ **多浏览器支持**
- Chrome (桌面 & 移动)
- Firefox (桌面)
- Safari (桌面 & iOS)
- 响应式设计验证

✅ **工程级实践**
- Page Object Model (POM) 架构
- 完整的测试文档
- CI/CD 工作流 (GitHub Actions)
- 测试报告生成和展示
- 环境管理最佳实践

✅ **易于维护**
- 清晰的项目结构
- 详细的注释和文档
- 可复用的辅助函数
- 标准的命名约定

### 项目统计

| 指标 | 数值 |
|-----|------|
| 测试文件 | 13+ |
| 测试用例 | 20+ |
| 页面对象 | 3 |
| 测试类型 | 6 (E2E, API, Security, Performance, Accessibility, Compatibility) |
| 覆盖的浏览器 | 5 |

---

## 快速启动

### 系统要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **操作系统**: macOS, Windows, 或 Linux
- **内存**: 至少 2GB RAM

### 安装步骤

#### 1. Clone 项目

```bash
git clone https://github.com/your-username/test-project.git
cd test-project
```

#### 2. 安装依赖

```bash
npm ci
```

#### 3. 安装 Playwright 浏览器

```bash
npx playwright install --with-deps
```

#### 4. 配置环境变量

```bash
# 从示例文件创建
cp .env.example .env

# 编辑 .env 文件，添加测试账户凭证
# TEST_USERNAME=your_username
# TEST_PASSWORD=your_password

# 或使用 export 设置环境变量
export TEST_USERNAME=your_username
export TEST_PASSWORD=your_password
```

#### 5. 验证环境

```bash
bash scripts/check-env.sh
```

#### 6. 运行测试

```bash
npm test
```

---

## 项目结构

```
test-project/
├── .github/workflows/
│   ├── ci.yml              # CI 审计和 Lint 工作流
│   └── test.yml            # 测试执行工作流
├── docs/
│   ├── test_plan/
│   │   └── TEST_PLAN.md           # 详细测试计划
│   ├── guidelines/
│   │   └── TESTING_GUIDE.md       # 测试执行指南
│   └── reports/
│       └── TEST_EXECUTION_REPORT.md  # 报告模板
├── scripts/
│   ├── check-env.sh        # 环境检查脚本
│   └── generate-report.sh  # 报告生成脚本
├── tests/
│   ├── e2e/                # 端到端测试
│   │   ├── home.spec.ts
│   │   ├── login.spec.ts
│   │   ├── search.spec.ts
│   │   ├── about.spec.ts
│   │   └── ...
│   ├── api/                # API 测试
│   │   └── forum_api.spec.ts
│   ├── security/           # 安全测试
│   │   ├── xss.spec.ts
│   │   ├── csrf.spec.ts
│   │   └── accessibility.spec.ts
│   ├── performance/        # 性能测试
│   │   └── performance.spec.ts
│   ├── pages/              # 页面对象
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   └── LoginPage.ts
│   └── utils/              # 测试工具
│       └── config.ts
├── reports/                # 测试报告
│   ├── html/               # HTML 报告
│   └── test-results.json   # JSON 结果
├── config/                 # 配置文件
├── coverage/               # 覆盖率报告
├── .env.example            # 环境变量示例
├── CONTRIBUTING.md         # 贡献指南
├── playwright.config.ts    # Playwright 配置
├── package.json            # 项目依赖
├── package-lock.json       # 依赖锁定文件
├── Dockerfile              # Docker 配置
└── README.md               # 本文件
```

---

## 测试类型

### 1. 端到端 (E2E) 测试

验证用户完整业务流程：

```bash
npm run test:e2e

# 包含的场景:
# - 主页加载和导航
# - 用户登录流程
# - 搜索功能
# - 页面导航
```

### 2. API 测试

验证后端 REST API 的可靠性：

```bash
npm run test:api

# 测试内容:
# - GET /api/discussions 端点
# - GET /api/tags 端点
# - 响应数据完整性
# - 响应时间
```

### 3. 安全测试

验证应用安全防护机制：

```bash
npm run test:security

# 包含的测试:
# - XSS (跨站脚本) 防护
# - CSRF (跨站请求伪造) 防护
# - 敏感信息泄露检查
# - WCAG 无障碍合规性
```

### 4. 性能测试

监控关键性能指标：

```bash
npm run test:performance

# 测试指标:
# - 页面加载时间 (< 1500ms)
# - API 响应时间 (< 1000ms)
# - 资源加载时间
```

### 5. 兼容性测试

验证跨浏览器、跨设备的表现一致性：

```bash
npm run test:mobile         # 移动设备测试
npm run test:firefox        # Firefox 浏览器
npm run test:webkit         # Safari 浏览器
```

### 6. 可访问性测试

验证 WCAG 2.0 AA 合规性：

```bash
npm run test:accessibility

# 使用 axe-core 进行自动扫描
```

---

## 配置和环境

### Playwright 配置

主要配置位于 `playwright.config.ts`：

```typescript
// 测试超时
timeout: 30000,

// 浏览器配置
projects: [
  { name: 'chromium' },
  { name: 'firefox' },
  { name: 'webkit' },
  { name: 'Mobile Chrome' },
  { name: 'Mobile Safari' }
],

// 报告配置
reporter: [
  ['html', { outputFolder: 'reports/html' }],
  ['json', { outputFile: 'reports/test-results.json' }]
]
```

### 环境变量

| 变量 | 说明 | 示例 |
|-----|------|------|
| `TEST_USERNAME` | 测试用户名 | `testuser` |
| `TEST_PASSWORD` | 测试密码 | `pass123` |
| `BASE_URL` | 目标网站 | `https://www.wangdanatest.top` |
| `HEADLESS` | 无头模式 | `true` |
| `CI` | CI 环境标志 | `true` |

---

## 运行测试

### 基本命令

```bash
# 运行所有测试
npm test

# 交互式 UI 模式（推荐用于开发）
npm run test:ui

# 调试模式（附带浏览器开发者工具）
npm run test:debug

# 查看上次失败的测试
npm run test:failed

# 查看测试报告
npm run test:report
```

### 高级选项

```bash
# 特定浏览器
npm run test:chromium  # Chrome 桌面
npm run test:firefox   # Firefox 桌面
npm run test:webkit    # Safari 桌面

# 特定测试套件
npm run test:e2e         # 端到端测试
npm run test:api         # API 测试
npm run test:security    # 安全测试
npm run test:performance # 性能测试
npm run test:mobile      # 移动设备测试

# 特定测试文件
npx playwright test tests/e2e/login.spec.ts

# 搜索特定测试
npx playwright test -g "验证主页标题"

# 单线程执行
npx playwright test --workers=1

# 有头浏览器（显示浏览器窗口）
npm run test:headed
```

### Docker 运行

```bash
# 构建 Docker 镜像
docker build -t test-project .

# 运行容器内的测试
docker run --rm -v $(pwd):/app -w /app test-project npm test

# Linux 开发环境
docker run --rm -v $(pwd):/app -w /app -it mcr.microsoft.com/playwright:v1.43.0-jammy bash
```

---

## 持续集成

### GitHub Actions

项目已配置 GitHub Actions 工作流：

**文件**: `.github/workflows/test.yml`

**触发条件**:
- 推送到 `main` 或 `develop` 分支
- 创建拉取请求到 `main` 或 `develop` 分支
- 每天定时运行 (UTC 1:00 = 北京时间 9:00)

**工作流步骤**:
1. 检出代码
2. 设置 Node.js 环境
3. 安装依赖
4. 安装 Playwright 浏览器
5. 运行所有测试
6. 生成测试报告
7. 上传构件

**访问报告**:
- GitHub Actions 日志
- 下载测试报告构件
- 查看 HTML 报告

### 设置 CI/CD

1. **添加 GitHub Secrets**:

```
Settings > Secrets and variables > Actions > New repository secret

TEST_USERNAME = your_test_username
TEST_PASSWORD = your_test_password
```

2. **查看工作流状态**:

```
Actions 标签 > 选择工作流 > 查看运行历史
```

3. **下载报告**:

```
Actions > 最新运行 > Artifacts > 下载报告
```

---

## 文档

### 主要文档

1. **[测试计划](./docs/test_plan/TEST_PLAN.md)**
   - 测试目标和范围
   - 完整的测试用例
   - 测试执行计划
   - 缺陷管理流程

2. **[执行指南](./docs/guidelines/TESTING_GUIDE.md)**
   - 快速启动步骤
   - 测试调试技巧
   - 页面对象模型说明
   - 编写新的测试用例
   - 最佳实践
   - 故障排除

3. **[贡献指南](./CONTRIBUTING.md)**
   - 如何贡献
   - 代码风格指南
   - 提交消息约定
   - Pull Request 流程
   - 审查标准

4. **[测试报告](./docs/reports/TEST_EXECUTION_REPORT.md)**
   - 报告模板
   - 数据收集
   - 分析方法

### 快速参考

| 文档 | 用途 |
|------|------|
| [test_plan/TEST_PLAN.md](./docs/test_plan/TEST_PLAN.md) | 了解所有测试用例 |
| [guidelines/TESTING_GUIDE.md](./docs/guidelines/TESTING_GUIDE.md) | 学习如何运行和编写测试 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 了解如何贡献代码 |
| [reports/TEST_EXECUTION_REPORT.md](./docs/reports/TEST_EXECUTION_REPORT.md) | 生成和分析报告 |

---

## 提交问题

发现 Bug 或有改进建议？请提交 GitHub Issue：

### Issue 模板

```markdown
**问题类型**: [Bug | Feature Request | Documentation]

**描述**:
清楚、简明地描述问题。

**复现步骤**:
1. 运行命令: `npm test`
2. 观察到的错误
3. 其他步骤

**预期结果**: 应该发生什么

**实际结果**: 实际发生了什么

**环境**:
- 操作系统: [Windows/Mac/Linux]
- Node.js 版本: [版本号]
- Playwright 版本: [版本号]

**附加信息**: 截图、日志或其他信息
```

---

## 贡献指南

我们欢迎各种形式的贡献！😊

### 贡献类型

- 🐛 报告 Bug
- ✨ 提交新功能
- 📚 改进文档
- 🧯 修复代码
- 🔍 代码审查

### 贡献流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 许可证

此项目采用 [MIT License](./LICENSE) 许可证。

---

## 常用命令速查表

```bash
# 项目初始化
npm ci
npx playwright install --with-deps

# 运行测试
npm test                 # 所有测试
npm run test:ui          # UI 模式
npm run test:api         # API 测试
npm run test:security    # 安全测试
npm run test:e2e         # E2E 测试

# 调试和报告
npm run test:debug       # 调试模式
npm run test:report      # 查看报告
npm run coverage         # 覆盖率报告

# 代码质量
npm run lint             # 代码检查
npm run format           # 代码格式化

# 检查
bash scripts/check-env.sh  # 环境检查
```

---

## 项目进度

- ✅ 项目框架搭建
- ✅ E2E 功能测试
- ✅ API 接口测试
- ✅ 安全防护测试
- ✅ 性能测试
- ✅ 可访问性检查
- ✅ CI/CD 工作流
- ✅ 文档完成
- 🔄 测试覆盖率优化
- 🔄 负载测试
- 📋 可视化仪表板

---

## 联系方式

- 📧 Email: qa-team@example.com
- 💬 Issues: [GitHub Issues](https://github.com/your-username/test-project/issues)
- 📚 Discussions: [GitHub Discussions](https://github.com/your-username/test-project/discussions)

---

## 相关资源

- [Playwright 官方文档](https://playwright.dev)
- [测试最佳实践](https://playwright.dev/docs/best-practices)
- [WCAG 2.0 标准](https://www.w3.org/WAI/WCAG20/quickref/)
- [OWASP 十大漏洞](https://owasp.org/Top10/)

---

**感谢使用本项目！** 🎉

如有任何问题或建议，欢迎提交 Issue 或 Pull Request。

---

**文档版本**: 1.0
**最后更新**: 2026-02-21
**维护者**: QA Team

