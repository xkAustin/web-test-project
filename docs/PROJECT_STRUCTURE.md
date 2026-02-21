# 项目结构和文件说明

## 完整的项目文件结构

```
test-project/
│
├── 📋 根目录文件
│   ├── README.md                  # 项目主文档（开发者入门）
│   ├── CONTRIBUTING.md            # 贡献指南
│   ├── LICENSE                    # MIT 许可证
│   ├── package.json              # 项目依赖配置
│   ├── package-lock.json         # 依赖锁定文件
│   ├── playwright.config.ts      # Playwright 测试框架配置
│   ├── .env.example              # 环境变量示例
│   ├── .gitignore                # Git 忽略文件配置
│   └── Dockerfile                # Docker 容器化配置
│
├── 📁 .github/
│   └── workflows/
│       ├── ci.yml                # CI 审计工作流（npm audit 等）
│       └── test.yml              # 测试执行工作流（主要 CI/CD）
│
├── 📁 docs/                       # 项目文档目录
│   ├── test_plan/
│   │   └── TEST_PLAN.md          # 详细的测试计划文档
│   │       - 测试目标和范围
│   │       - 完整的测试用例（20+）
│   │       - 测试执行计划
│   │       - 缺陷管理流程
│   │       - 成功标准
│   │
│   ├── guidelines/
│   │   └── TESTING_GUIDE.md      # 测试执行和编写指南
│   │       - 快速启动步骤
│   │       - 环境配置详解
│   │       - 所有测试命令
│   │       - 调试方法和技巧
│   │       - Page Object Model 说明
│   │       - 编写新测试的步骤
│   │       - 最佳实践
│   │       - 故障排除指南
│   │
│   └── reports/
│       └── TEST_EXECUTION_REPORT.md  # 测试报告模板和指南
│           - 执行摘要格式
│           - 数据收集方法
│           - 报告分析方式
│
├── 📁 scripts/                    # 自动化脚本
│   ├── check-env.sh              # 环境检查脚本
│   │   - 检查 Node.js 和 npm
│   │   - 验证依赖安装
│   │   - 检查项目文件
│   │   - 验证环境变量
│   │   - 检查目录结构
│   │
│   └── generate-report.sh        # 报告生成脚本
│       - 解析测试结果
│       - 生成统计信息
│       - 创建可视化报告
│
├── 📁 tests/                      # 测试代码目录
│   │
│   ├── e2e/                       # 端到端测试（用户完整流程）
│   │   ├── home.spec.ts          # 首页测试用例
│   │   ├── login.spec.ts         # 登录功能测试
│   │   ├── search.spec.ts        # 搜索功能测试
│   │   ├── about.spec.ts         # 关于页面测试
│   │   ├── edge.spec.ts          # 边界情况测试
│   │   ├── edge_cases.spec.ts    # 综合边界情况
│   │   └── csrf.spec.ts          # CSRF 防护测试
│   │
│   ├── api/                       # API 接口测试
│   │   └── forum_api.spec.ts     # 论坛 API 端点测试
│   │       - GET /api/discussions
│   │       - GET /api/tags
│   │       - 响应验证
│   │
│   ├── security/                  # 安全性测试
│   │   ├── xss.spec.ts           # XSS 防护测试
│   │   ├── csrf.spec.ts          # CSRF 防护测试
│   │   └── accessibility.spec.ts # WCAG 可访问性测试
│   │
│   ├── performance/               # 性能测试
│   │   └── performance.spec.ts   # 页面加载时间和性能指标
│   │
│   ├── pages/                     # 页面对象模型 (POM)
│   │   ├── BasePage.ts           # 基础页面类（公共方法）
│   │   │   - navigateTo()
│   │   │   - getTitle()
│   │   │   - waitForElement()
│   │   │   - click()
│   │   │   - fill()
│   │   │
│   │   ├── HomePage.ts           # 首页页面对象
│   │   │   - searchFor()
│   │   │   - goToLogin()
│   │   │   - getNavigationMenu()
│   │   │
│   │   └── LoginPage.ts          # 登录页面对象
│   │       - login()
│   │       - getErrorMessage()
│   │       - fillUsername()
│   │       - fillPassword()
│   │
│   └── utils/                     # 测试工具函数
│       ├── config.ts             # 测试配置和环境变量
│       └── (其他工具函数)
│
├── 📁 reports/                    # 测试报告和结果
│   ├── html/                      # HTML 格式报告
│   │   └── index.html            # 可视化测试报告
│   │
│   └── test-results.json         # 原始测试结果（JSON 格式）
│
├── 📁 coverage/                   # 代码覆盖率报告
│   └── (覆盖率统计)
│
├── 📁 config/                     # 其他配置文件
│   └── (项目配置)
│
└── 📁 .claude/
    └── settings.local.json       # Claude Code 本地设置
```

---

## 关键文件说明

### 根级文档

#### README.md
**目的**: 项目主文档
**包含内容**:
- 项目概述和核心特性
- 快速启动步骤
- 项目结构图
- 测试类型说明
- 所有可用命令
- CI/CD 配置说明
- 贡献流程

**受众**: 所有开发者和基础用户

---

#### CONTRIBUTING.md
**目的**: 贡献指南
**包含内容**:
- 贡献类型和方式
- 代码风格指南
- 提交消息规范
- Pull Request 流程
- 审查标准
- 测试要求

**受众**: 想要为项目贡献代码的开发者

---

### 测试文档

#### docs/test_plan/TEST_PLAN.md
**目的**: 完整的测试规划文档
**包含内容**:
- 测试目标（6 种测试类型）
- 详细测试范围定义
- 20+ 个具体测试用例（附用例编号 TC-xxx-xxx）
- 优先级和自动化状态
- 测试执行计划
- 测试数据管理
- 缺陷处理流程
- 测试成功标准

**受众**: QA 经理、测试工程师、项目经理

**使用场景**:
- 制定测试策略
- 跟踪测试覆盖率
- 评估测试进度
- 执行缺陷管理

---

#### docs/guidelines/TESTING_GUIDE.md
**目的**: 测试执行实操指南
**包含内容**:
- 系统要求和安装步骤
- 环境配置详细说明
- 所有测试命令的用法和示例
- 测试调试方法
- Page Object Model (POM) 详解
- 编写新测试用例的步骤和示例
- 代码最佳实践
- 常见问题排除

**受众**: 测试工程师、开发者、新入职人员

**使用场景**:
- 新手上手学习
- 日常测试执行
- 问题排查
- 改进工作流

---

#### docs/reports/TEST_EXECUTION_REPORT.md
**目的**: 测试报告模板和生成指南
**包含内容**:
- 报告结构和格式
- 数据收集方法
- 统计分析方式
- 趋势分析
- 缺陷报告
- 性能指标
- 后续建议

**受众**: QA 报告员、项目经理

**使用场景**:
- 每周/月报告生成
- 管理层汇报
- 项目进度跟踪

---

### 配置文件

#### playwright.config.ts
**目的**: Playwright 框架配置
**配置项**:
- 测试目录: `./tests`
- 超时设置: 30000ms
- 并行执行: 支持
- 浏览器项目: 5 个（Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari）
- 报告格式: HTML + JSON
- 截图和视频: 仅失败时保存

---

#### package.json
**目的**: 项目依赖和脚本定义
**主要脚本** (15+):
```
npm test                  # 所有测试
npm run test:ui          # UI 交互模式
npm run test:e2e         # E2E 测试
npm run test:api         # API 测试
npm run test:security    # 安全测试
npm run test:performance # 性能测试
npm run test:debug       # 调试模式
npm run test:report      # 查看报告
... 等等
```

**依赖包**:
- `@playwright/test`: 核心测试框架
- `dotenv`: 环境变量管理
- `axe-playwright`: 可访问性测试
- `nyc`: 覆盖率报告

---

#### .env.example
**目的**: 环境变量配置示例
**必需变量**:
```
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
```

**可选变量**:
```
BASE_URL, HEADLESS, LOG_LEVEL, WORKERS, 等
```

---

#### Dockerfile
**目的**: Docker 容器化配置
**用途**: 在容器内运行测试，确保一致的执行环境

---

### 脚本文件

#### scripts/check-env.sh
**目的**: 环境验证脚本
**检查项**:
- Node.js 和 npm 安装
- 项目依赖完整性
- 环境变量配置
- Playwright 浏览器驱动
- 项目文件结构

**执行**:
```bash
bash scripts/check-env.sh
```

---

#### scripts/generate-report.sh
**目的**: 自动生成测试报告
**功能**:
- 解析 JSON 测试结果
- 计算统计信息
- 生成可视化报告
- 输出明细汇总

**执行**:
```bash
bash scripts/generate-report.sh
```

---

## 文件数据流

```
开发者编写测试
    ↓
package.json (定义执行命令)
    ↓
playwright.config.ts (配置框架)
    ↓
.env (加载环境变量)
    ↓
tests/ (执行测试代码)
    ├── e2e/, api/, security/, performance/
    └── pages/ (使用页面对象)
    ↓
reports/ (生成结果)
    ├── test-results.json
    └── html/index.html
    ↓
scripts/generate-report.sh (分析结果)
    ↓
docs/reports/TEST_EXECUTION_REPORT.md (生成报告)
```

---

## 文件大小和维护

| 文件 | 大小 | 更新频率 | 优先级 |
|------|------|--------|-------|
| README.md | ~10KB | 低（结构变化时） | 高 |
| TEST_PLAN.md | ~25KB | 低（需求变化时） | 高 |
| TESTING_GUIDE.md | ~20KB | 低（流程改进时） | 中 |
| CONTRIBUTING.md | ~15KB | 低（规范变化时） | 中 |
| package.json | ~2KB | 中（依赖更新时） | 高 |
| playwright.config.ts | ~2KB | 低（配置调整时） | 高 |
| 测试文件 (~13) | 50KB | 高（持续增加） | 高 |
| 页面对象 (3) | 10KB | 中（UI 变化时） | 高 |

---

## 最佳实践

### 何时更新文档

| 文档 | 触发条件 |
|------|--------|
| TEST_PLAN.md | 添加新的测试用例、更改优先级 |
| TESTING_GUIDE.md | 新的测试工具、新的命令、工作流改进 |
| CONTRIBUTING.md | 代码风格改变、PR 流程更新 |
| README.md | 项目结构大改、新增主要特性 |
| package.json | npm 依赖更新 |

### 文件管理建议

1. **定期检查**: 每月审查文档完整性
2. **及时更新**: 代码变更时同时更新文档
3. **版本控制**: 使用 Git 跟踪所有文档变化
4. **备份重要内容**: 定期导出测试结果和报告

---

## 相关命令速查

```bash
# 查看项目结构
tree -L 3 -I 'node_modules'

# 检查文件大小
du -sh docs/ tests/ reports/

# 查看项目统计
cloc --include-lang=TypeScript tests/

# 验证所有文件
bash scripts/check-env.sh

# 更新文档链接
find docs -name "*.md" -exec sed -i 's|old_path|new_path|g' {} \;
```

---

**文档版本**: 1.0
**最后更新**: 2026-02-21

