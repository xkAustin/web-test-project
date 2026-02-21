# 贡献指南 (CONTRIBUTING.md)

感谢你对本项目的兴趣！本文档将指导你如何为项目做出贡献。

## 目录

1. [行为准则](#行为准则)
2. [如何贡献](#如何贡献)
3. [提交问题](#提交问题)
4. [提交拉取请求](#提交拉取请求)
5. [代码风格](#代码风格)
6. [提交消息约定](#提交消息约定)
7. [测试要求](#测试要求)

---

## 行为准则

所有参与者应该遵循以下原则：

- **尊重**: 尊重所有贡献者和维护者
- **包容**: 欢迎不同背景和观点的贡献
- **专业**: 使用适当和专业的语言
- **合作**: 秉着合作精神解决问题

---

## 如何贡献

### 贡献类型

1. **报告 Bug** - 发现并报告测试中的问题
2. **提交功能请求** - 建议新的测试用例或功能
3. **改进文档** - 完善或翻译现有文档
4. **提交代码** - 修复 Bug 或实现新功能
5. **代码审查** - 审查他人的拉取请求

### 开始前

1. 检查 [Issue](https://github.com/your-repo/issues) 列表，确保没有重复
2. 阅读 [测试计划](../test_plan/TEST_PLAN.md) 和 [执行指南](./TESTING_GUIDE.md)
3. Fork 本项目
4. Clone 你的 Fork

```bash
git clone https://github.com/your-username/test-project.git
cd test-project
```

---

## 提交问题

### 何时提交 Issue

- 发现 Bug 或测试失败
- 发现安全漏洞
- 建议新的功能或改进
- 报告文档缺失或不清楚

### Issue 模板

```markdown
**问题类型**: [Bug | Feature Request | Documentation | Question]

**描述**:
清楚、简明地描述问题。

**复现步骤** (仅适用于 Bug):
1. 运行命令: `npx playwright test -g "test name"`
2. 观察到的错误
3. 其他步骤

**预期行为**:
应该发生什么

**实际行为**:
实际发生了什么

**测试环境**:
- 操作系统: [Windows/Mac/Linux]
- Node.js 版本: [版本号]
- npm 版本: [版本号]
- Playwright 版本: [版本号]

**附加信息**:
- 截图或日志
- 错误堆栈跟踪
- 其他相关信息

**优先级**: [P0 Critical | P1 High | P2 Medium | P3 Low]
```

---

## 提交拉取请求

### PR 工作流程

1. **创建分支**

```bash
# 创建功能分支
git checkout -b feature/test-user-registration
# 或修复分支
git checkout -b fix/login-page-selector
```

分支命名规则：
- 功能: `feature/description`
- 修复: `fix/description`
- 文档: `docs/description`
- 重构: `refactor/description`

2. **提交更改**

```bash
# 添加更改
git add .

# 提交（遵循提交消息约定）
git commit -m "feat: add login test case"
```

3. **同步主分支**

```bash
# 添加上游
git remote add upstream https://github.com/original-owner/test-project.git

# 拉取最新更改
git fetch upstream main
git rebase upstream/main
```

4. **推送和创建 PR**

```bash
# 推送到你的 fork
git push origin feature/test-user-registration

# 然后在 GitHub 上创建 PR
```

### PR 模板

```markdown
## 描述

简要描述你的更改做了什么。

## 相关 Issue

关闭 #123

## 变更类型

- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 性能优化
- [ ] 代码重构

## 测试更改

描述你如何测试这些更改：

```bash
npm test
```

## 检查清单

- [ ] 我已阅读 CONTRIBUTING.md
- [ ] 我的代码遵循项目的代码风格
- [ ] 我已为新功能添加测试
- [ ] 所有新的和现有的测试通过了
- [ ] 我已更新相关文档
- [ ] 我的提交消息遵循约定

## 截图或日志 (如适用)

添加相关的截图或日志。
```

### PR 审查周期

1. **自动检查**: GitHub Actions 运行所有测试
2. **代码审查**: 维护者审查你的代码
3. **修改阶段**: 根据反馈进行调整
4. **合并**: 获批准后合并到 main 分支

---

## 代码风格

### TypeScript 风格指南

```typescript
// ✓ 好的风格
class LoginPage extends BasePage {
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click('button[type="submit"]');
  }
}

// ✗ 避免
class LoginPage {
  login = async (u: any, p: any) => {
    // 缩写变量
    await this.page.fill('input', u);
  };
}
```

### 命名约定

- **类名**: PascalCase (e.g., `LoginPage`, `HomePage`)
- **方法/函数**: camelCase (e.g., `navigateTo()`, `getErrorMessage()`)
- **常量**: UPPER_SNAKE_CASE (e.g., `MAX_TIMEOUT`, `BASE_URL`)
- **私有成员**: 前缀下划线或 `private` (e.g., `_privateField`)
- **测试名称**: 清晰的中文/英文描述

### 格式化

```typescript
// 使用 Prettier
npm run format

// 或
npx prettier --write tests/**/*.ts

// 使用 ESLint
npm run lint
npm run lint:fix
```

### 文件组织

```
tests/
├── e2e/           # 端到端测试
├── api/           # API 测试
├── security/      # 安全测试
├── performance/   # 性能测试
├── pages/         # 页面对象
│   ├── BasePage.ts
│   ├── HomePage.ts
│   └── LoginPage.ts
└── utils/         # 工具函数
    ├── config.ts
    └── constants.ts
```

---

## 提交消息约定

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (类型)

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码风格（不改变功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `ci`: CI/CD 配置
- `chore`: 其他（依赖更新等）

### Scope (范围)

- `home`: 首页
- `login`: 登录页面
- `search`: 搜索功能
- `api`: API 测试
- `security`: 安全测试
- `config`: 配置文件

### 示例

```
feat(login): add login page test cases

- Add TC-LOGIN-001: valid credentials
- Add TC-LOGIN-002: invalid credentials
- Add TC-LOGIN-003: empty fields

Closes #123
```

```
fix(search): fix selector for search results

Update selector due to DOM structure change.
The old selector '.results' no longer exists,
replaced with '[data-testid="search-results"]'.

Fixes #456
```

```
docs(test-plan): update test coverage matrix

Add new security test cases to the matrix
and update the test execution timeline.
```

---

## 测试要求

### 必需的测试

所有提交的代码都必须包含适当的测试：

| 场景 | 测试要求 |
|------|--------|
| 新的 Page Object 方法 | 必须有对应的 E2E 测试 |
| Bug 修复 | 必须添加回归测试 |
| 新的测试用例 | 代码审查通过 |
| 文档更新 | 不需要测试 |

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定套件
npm run test:api
npm run test:security
npm run test:performance

# UI 模式（开发时使用）
npm run test:ui

# 调试模式
PWDEBUG=1 npm test
```

### 测试覆盖率

- 新代码的测试覆盖率应 ≥ 80%
- 不降低整体覆盖率
- 所有测试必须通过

### 性能要求

- 单个测试应在 30 秒内完成
- 整个套件应在 5 分钟内完成
- 不添加易超时的脆弱测试

---

## 审查标准

### 代码审查检查列表

- [ ] 代码清晰且易理解
- [ ] 遵循项目的代码风格
- [ ] 没有不必要的复杂性
- [ ] 测试覆盖充分
- [ ] 文档已更新
- [ ] 提交消息清晰
- [ ] 没有硬编码的值或凭证
- [ ] 没有断言依赖于其他测试

### 常见反馈

```
❌ "使用 POM 中的方法，避免 page.click()"
"Good: await this.loginPage.login(username, password)"

❌ "增加等待条件，避免硬编码的 waitForTimeout"
"Good: await page.waitForSelector('.result', { state: 'visible' })"

❌ "选择器不稳定，请使用数据属性或 role"
"Good: page.getByRole('button', { name: 'Submit' })"
```

---

## 获得帮助

- 📖 查看 [测试计划](../test_plan/TEST_PLAN.md)
- 📚 查看 [执行指南](./TESTING_GUIDE.md)
- 💬 在 Issues 中提问
- 🐛 查看 [故障排除](./TESTING_GUIDE.md#故障排除)

---

感谢你的贡献！🎉

**维护者**: QA Team
**最后更新**: 2026-02-21
