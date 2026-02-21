# 自动化测试执行指南

## 目录

1. [快速启动](#快速启动)
2. [测试环境配置](#测试环境配置)
3. [运行测试](#运行测试)
4. [调试失败的测试](#调试失败的测试)
5. [页面对象模型 (POM)](#页面对象模型)
6. [编写新的测试用例](#编写新的测试用例)
7. [最佳实践](#最佳实践)
8. [故障排除](#故障排除)

---

## 快速启动

### 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- 任意现代操作系统 (macOS, Windows, Linux)

### 初始化项目

```bash
# 1. 克隆或进入项目目录
cd test_project

# 2. 安装项目依赖
npm ci

# 3. 安装 Playwright 浏览器驱动
npx playwright install --with-deps

# 4. 创建 .env 文件
cp .env.example .env

# 5. 编辑 .env 文件，添加测试账户凭证
# TEST_USERNAME=your_username
# TEST_PASSWORD=your_password
```

---

## 测试环境配置

### .env 文件配置

创建 `.env` 文件在项目根目录：

```env
# 测试账户凭证
TEST_USERNAME=wangdana
TEST_PASSWORD=yourpassword123

# 目标网站 URL (可选，已在 playwright.config.ts 中配置)
BASE_URL=https://www.wangdanatest.top

# 日志级别 (可选)
LOG_LEVEL=info

# 测试运行配置 (可选)
HEADLESS=true
TIMEOUT=30000
```

### 环境变量说明

| 变量 | 说明 | 示例 | 必需 |
|-----|------|------|------|
| `TEST_USERNAME` | 测试用户名 | `testuser` | ✓ |
| `TEST_PASSWORD` | 测试密码 | `pass123` | ✓ |
| `BASE_URL` | 目标网站 URL | `https://www.wangdanatest.top` | ✗ |
| `HEADLESS` | 无头浏览器模式 | `true` | ✗ |
| `TIMEOUT` | 测试超时时间(ms) | `30000` | ✗ |

---

## 运行测试

### 主要命令

#### 1. 运行所有测试

```bash
npm test
```

- 在所有已配置的浏览器中运行所有测试
- 并行执行多个浏览器
- 包括台式机和移动设备

#### 2. UI 交互模式（推荐用于开发）

```bash
npm run test:ui
```

- 启动 Playwright Inspector UI
- 实时查看测试执行过程
- 可以暂停、继续、单步执行
- 便于调试和学习

#### 3. 特定浏览器测试

```bash
# 仅 Chrome
npm run test:chromium

# Firefox
npx playwright test --project=firefox

# Safari
npx playwright test --project=webkit

# 移动 Chrome (Android)
npx playwright test --project="Mobile Chrome"

# 移动 Safari (iOS)
npx playwright test --project="Mobile Safari"
```

#### 4. 特定测试套件

```bash
# 运行所有 API 测试
npm run test:api

# 运行所有安全测试
npm run test:security

# 运行所有性能测试
npm run test:performance
```

#### 5. 运行特定测试文件

```bash
# 运行某一个测试文件
npx playwright test tests/e2e/home.spec.ts

# 运行特定测试用例
npx playwright test -g "验证主页标题"
```

#### 6. 高级选项

```bash
# 以调试模式运行，打开浏览器开发者工具
npx playwright test --debug

# 运行失败的测试
npx playwright test --last-failed

# 指定工作线程数
npx playwright test --workers=1  # 单线程

# 显示详细日志
npx playwright test --verbose

# 不生成报告，只打印结果
npx playwright test --reporter=list
```

---

## 调试失败的测试

### 查看测试报告

```bash
# 生成 HTML 报告
npm run test:report

# 自动在浏览器中打开报告
npx playwright show-report reports/html
```

报告包含：
- 测试执行摘要
- 失败的测试详情
- 截图和视频录制
- 详细的错误堆栈跟踪

### 使用 Playwright Inspector

```bash
# 启用调试模式
PWDEBUG=1 npm test

# 或使用 --debug 标志
npx playwright test --debug
```

Inspector 功能：
- 逐步执行每一行代码
- 查看 DOM 选择器
- 执行任意 JavaScript
- 检查网络请求

### 常见失败原因

| 失败原因 | 解决方案 |
|---------|--------|
| 元素选择器错误 | 使用 Inspector 验证选择器 |
| 网络问题 | 检查网络连接，增加超时 |
| 异步操作超时 | 使用 `waitFor*` 方法 |
| 凭证错误 | 验证 .env 文件配置 |
| 页面崩溃 | 查看浏览器控制台错误 |

---

## 页面对象模型 (POM)

### 什么是 POM？

页面对象模型是一种设计模式，将页面元素和交互逻辑封装到专门的类中。

**优点**：
- 降低测试脆性（选择器变化只需更新一处）
- 提高代码可读性和可维护性
- 便于代码复用

### POM 结构

```
tests/pages/
├── BasePage.ts      # 基础页面类（公共方法）
├── HomePage.ts      # 首页
├── LoginPage.ts     # 登录页
└── SearchPage.ts    # 搜索结果页
```

### BasePage 示例

```typescript
// tests/pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(path: string = '/') {
    await this.page.goto(path);
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async getText(selector: string) {
    return await this.page.textContent(selector);
  }
}
```

### 具体页面实现

```typescript
// tests/pages/LoginPage.ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // 定义页面选择器
  private usernameInput = 'input[name="username"]';
  private passwordInput = 'input[name="password"]';
  private submitButton = 'button[type="submit"]';
  private errorMessage = '.error-message';

  // 定义页面交互方法
  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }
}
```

---

## 编写新的测试用例

### 测试文件模板

创建新的测试文件（如 `tests/e2e/forum.spec.ts`）：

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('论坛功能测试', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // 在每个测试前执行
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await homePage.navigateTo();
  });

  test('TC-FORUM-001: 查看论坛帖子', async ({ page }) => {
    // Arrange (准备)
    await homePage.navigateTo('/forum');

    // Act (执行)
    const postTitle = await page.textContent('.post-title');

    // Assert (断言)
    expect(postTitle).toBeTruthy();
  });

  test('TC-FORUM-002: 搜索论坛帖子', async ({ page }) => {
    // 测试代码
  });

  test.afterEach(async ({ page }) => {
    // 在每个测试后执行
    await page.close();
  });
});
```

### 最佳实践

#### 1. 使用有意义的测试名称

```typescript
// ✓ 好的名称
test('TC-LOGIN-001: 用户能够使用有效凭证登录');

// ✗ 不好的名称
test('login test');
test('应该工作');
```

#### 2. 使用 AAA 模式

```typescript
test('TC-HOME-001: 验证主页标题', async ({ page }) => {
  // Arrange - 准备测试数据和环境
  const homePage = new HomePage(page);

  // Act - 执行用户操作
  await homePage.navigateTo();
  const title = await homePage.getTitle();

  // Assert - 验证结果
  expect(title).toBe('Wangdana Forum');
});
```

#### 3. 使用适当的等待机制

```typescript
// ✓ 最佳实践
await page.waitForSelector('.results', { state: 'visible' });
await page.waitForLoadState('networkidle');

// ✗ 避免使用硬编码等待
// await page.waitForTimeout(2000);
```

#### 4. 处理异常情况

```typescript
test('TC-SEARCH-002: 处理空搜索结果', async ({ page }) => {
  const searchPage = new SearchPage(page);

  // 搜索不存在的内容
  await searchPage.search('xyzabc123notfound');

  // 验证空结果处理
  const resultText = await searchPage.getResultMessage();
  expect(resultText).toContain('没有找到');
});
```

#### 5. 使用 Fixtures 管理数据

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type TestFixtures = {
  authenticatedPage: void;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup - 登录
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo('/login');
    await loginPage.login('testuser', 'password');

    // Use - 提供给测试
    await use();

    // Teardown - 退出
    await page.context().clearCookies();
  },
});
```

---

## 最佳实践

### 1. 选择器策略

```typescript
// ✓ 优先级 (从高到低)
locator = page.getByRole('button', { name: 'Submit' });  // 语义选择器
locator = page.getByPlaceholder('Enter name');           // 占位符
locator = page.getByLabel('Username');                   // 标签
locator = page.locator('[data-testid="submit"]');        // 测试 ID
locator = page.locator('button.submit');                 // CSS 选择器

// ✗ 避免
locator = page.locator('html > body > div > form > div:nth-child(2) > input');  // XPath
```

### 2. 错误处理

```typescript
// ✓ 使用 try-catch 处理预期的失败
try {
  await page.click('.optional-element');
} catch (error) {
  console.log('Element not found, continuing...');
}

// ✓ 使用条件检查
const exists = await page.locator('.notification').isVisible();
if (exists) {
  await page.close();
}
```

### 3. 测试数据隔离

```typescript
// ✓ 每个测试使用独立数据
test('TC-USER-001', async ({ page }) => {
  const uniqueEmail = `test-${Date.now()}@example.com`;
  // 使用唯一数据
});

// ✗ 避免依赖其他测试的数据
test('TC-USER-002', async ({ page }) => {
  // 依赖 TC-USER-001 创建的数据
});
```

### 4. 记录和诊断

```typescript
// 添加有用的日志
test('TC-LOGIN-001', async ({ page, context }) => {
  console.log('Starting login test');

  await page.goto('/login');
  console.log('Navigated to login page');

  // 在截图中添加标记
  await page.screenshot({ path: `./screenshots/login-${Date.now()}.png` });

  // 记录网络请求
  page.on('request', request => console.log('>>', request.method(), request.url()));
});
```

---

## 故障排除

### 问题 1: 找不到元素

```
Error: Timeout waiting for selector '.login-button' to be visible
```

**解决方案**：
1. 使用 Inspector 验证选择器
2. 增加等待时间
3. 检查元素是否在不同的 iframe 中

```typescript
// 增加超时
await page.click('.login-button', { timeout: 10000 });

// 等待元素可见
await page.waitForSelector('.login-button', { state: 'visible' });

// 检查 iframe
const frame = page.frameLocator('iframe').locator('.login-button');
```

### 问题 2: 网络请求超时

```
Error: net::ERR_CONNECTION_TIMEOUT
```

**解决方案**：

```typescript
// 增加导航超时
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

// 使用 waitForLoadState
await page.waitForLoadState('networkidle');

// 跳过某些资源
context = await browser.newContext({
  extraHTTPHeaders: {
    'Accept': 'text/html'
  }
});
```

### 问题 3: 测试随机失败

**原因**：异步操作、网络波动、竞态条件

**解决方案**：

```typescript
// 启用重试
test('TC-001', async ({ page }) => {
  // 测试代码
});
test.describe.fixme('不稳定的测试套件', () => {
  // 暂时禁用
});

// 使用更可靠的等待机制
await expect(page.locator('.result')).toBeVisible({ timeout: 10000 });
```

### 问题 4: 凭证错误

```
Error: Invalid credentials
```

**解决方案**：

```bash
# 检查 .env 文件
cat .env

# 确保凭证正确
TEST_USERNAME=correct_username
TEST_PASSWORD=correct_password

# 重新安装依赖
npm ci
npx playwright install --with-deps
```

### 问题 5: 内存溢出

```
Error: out of memory
```

**解决方案**：

```typescript
// 减少并行工作线程
npx playwright test --workers=2

// 关闭不需要的功能
page.on('load', () => {
  page.evaluate(() => {
    // 禁用不需要的资源
  });
});
```

---

## 相关资源

- [Playwright 官方文档](https://playwright.dev)
- [测试计划](../TEST_PLAN.md)
- [API 参考](https://playwright.dev/docs/api/class-test)

---

**文档版本**: 1.0
**最后更新**: 2026-02-21
