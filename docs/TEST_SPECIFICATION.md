# 测试规范

**目标网站**: https://www.wangdanatest.top
**框架**: Playwright 1.43 + TypeScript 5.3
**测试用例总数**: 106

---

## 1. 测试目标与范围

### 测试类型

| 类型 | 描述 | 文件数 | 用例数 | 优先级 |
|------|------|--------|--------|--------|
| **E2E 功能测试** | 用户完整业务流程验证 | 6 | 46 | P0 |
| **API 测试** | 后端 REST 接口可靠性 | 1 | 10 | P0 |
| **安全测试** | XSS/CSRF 防护、可访问性 | 3 | 35 | P0 |
| **性能测试** | 页面加载、API 响应、资源指标 | 1 | 15 | P1 |

### 浏览器覆盖

| 浏览器 | 设备 |
|--------|------|
| Chromium | Desktop 1920×1080 |
| Firefox | Desktop 1920×1080 |
| WebKit (Safari) | Desktop 1920×1080 |
| Mobile Chrome | Pixel 5 |
| Mobile Safari | iPhone 12 |

### 环境

| 环境 | 用途 |
|------|------|
| 本地 | 开发与调试 |
| Docker | 一致性执行环境，CI 集成 |
| GitHub Actions | 自动触发 + 定时运行 |

---

## 2. 测试用例清单

### E2E — 主页 (home.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-001 | 主页加载成功，标题包含预期关键词 | P0 |
| TC-002 | header 和 footer 可见 | P0 |
| TC-003 | 登录/注册入口存在 | P0 |
| TC-004 | 搜索输入框可见 | P0 |
| TC-005 | 页面内容 > 1000 字符 | P0 |
| TC-006 | meta description 标签存在 | P1 |
| TC-007 | 页面加载时间 < 5s | P1 |
| TC-008 | viewport 尺寸已设置 | P1 |

### E2E — 登录 (login.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-009 | 登录页面加载成功 | P0 |
| TC-010 | 表单元素 (用户名/密码/提交) 可见 | P0 |
| TC-011 | 空字段提交→表单验证失败 | P0 |
| TC-012 | 有效凭证登录成功 | P0 |
| TC-013 | 无效密码→显示错误 | P0 |
| TC-014 | 无效用户名→显示错误 | P0 |
| TC-015 | 表单字段可正常输入 | P1 |
| TC-016 | "记住我"复选框功能 | P1 |
| TC-017 | 清空表单功能 | P1 |
| TC-018 | SQL 注入尝试被防护 | P0 |
| TC-019 | 密码字段接受特殊字符 | P1 |
| TC-020 | 登录后 URL 变化验证 | P1 |

### E2E — 搜索 (search.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-032 | 基本搜索功能 | P0 |
| TC-033 | 搜索输入框可见 | P0 |
| TC-034 | 多关键词搜索 | P1 |
| TC-035 | 空查询搜索 | P1 |
| TC-036 | 特殊字符搜索 | P2 |
| TC-037 | 搜索结果可见性 | P1 |
| TC-038 | 清除搜索查询 | P1 |
| TC-039 | 点击搜索结果 | P1 |
| TC-040 | 搜索响应时间 < 5s | P1 |

### E2E — 注册 (registration.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-092 | 注册页面加载成功 | P1 |
| TC-093 | 注册表单字段 (用户名/邮箱/密码) 可见 | P1 |
| TC-094 | 空字段提交→表单验证失败 | P1 |
| TC-095 | 有效注册流程 (生成唯一用户) | P1 |
| TC-096 | 无效邮箱格式被拒绝 | P1 |
| TC-097 | 弱密码可输入 (前端不强制强度) | P2 |
| TC-098 | 论坛讨论列表显示 | P1 |
| TC-099 | 创建讨论按钮存在 | P2 |
| TC-100 | 标签过滤功能 | P1 |
| TC-101 | 用户资料页面加载 | P2 |

### E2E — 边界情况 (edge_cases.spec.ts + about.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-091 | 关于页面导航和标题验证 | P1 |
| TC-Edge-01 | 缺少用户名→错误提示 | P1 |
| TC-Edge-02 | 缺少密码→错误提示 | P1 |
| TC-Edge-03 | 无结果搜索→空状态提示 | P1 |
| TC-Edge-04 | 不存在的路由→404 页面 | P1 |
| TC-Edge-05 | 导航后页面标题变化 | P1 |
| TC-Edge-06 | 登录后 session cookie 设置 | P1 |

### API (forum_api.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-021 | GET /api/discussions → 200, 返回数组 | P0 |
| TC-022 | GET /api/tags → 200 | P0 |
| TC-023 | 响应头 content-type 为 JSON | P0 |
| TC-024 | 响应时间 < 5s | P1 |
| TC-025 | GET /api/categories 返回有效状态码 | P1 |
| TC-026 | 无效端点返回错误状态码 | P1 |
| TC-027 | 分页参数 (page, limit) 支持 | P1 |
| TC-028 | POST /api/discussions 需要认证 | P1 |
| TC-029 | 响应头包含 CORS 信息 | P1 |
| TC-030 | 5 次连续请求→检查限流 (429) | P1 |

### 安全 — XSS (xss.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-081 | script 标签注入被转义 | P0 |
| TC-082 | img onerror 注入被转义 | P0 |
| TC-083 | svg onload 注入被转义 | P0 |
| TC-084 | 页面无内联事件处理器属性 | P0 |
| TC-085 | 反射型 XSS (HTML 标签) 被转义 | P0 |
| TC-086 | 链接中无 javascript: 协议 | P0 |
| TC-087 | data-* 属性不执行脚本 | P1 |
| TC-088 | style 标签注入不影响页面显示 | P1 |
| TC-089 | DOM 型 XSS 防护 (eval 不可达) | P0 |
| TC-090 | Content-Security-Policy 头存在 | P0 |

### 安全 — CSRF (security/csrf.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-041 | 无 token 的 POST → 403/401 | P0 |
| TC-042 | 登录表单包含 CSRF token | P0 |
| TC-043 | Session cookie 设置 SameSite 属性 | P0 |
| TC-044 | 跨站 Referer → 拒绝请求 | P0 |
| TC-045 | 跨站 Origin → 拒绝请求 | P0 |
| TC-046 | CSRF cookie (Double Submit) 存在 | P1 |
| TC-047 | POST/PUT/DELETE/PATCH 需要 token | P0 |
| TC-048 | GET/HEAD/OPTIONS 安全方法不受限 | P1 |
| TC-049 | X-Requested-With 头绕过验证 | P1 |
| TC-050 | Content-Type 验证 | P1 |

### 安全 — 可访问性 (accessibility.spec.ts)

| ID | 描述 | 优先级 |
|----|------|--------|
| TC-051 | 主页 WCAG2A + WCAG2AA 扫描 | P1 |
| TC-052 | 登录页无障碍扫描 | P1 |
| TC-053 | 表单标签正确关联 | P1 |
| TC-054 | 颜色对比度抽样验证 | P1 |
| TC-055 | 键盘导航 (Tab) 可用 | P1 |
| TC-056 | 标题层级正确 (h1 存在) | P1 |
| TC-057 | 图片有 alt 文本 | P1 |
| TC-058 | 表单错误消息可访问 | P1 |
| TC-059 | ARIA 地标存在 | P1 |
| TC-060 | HTML lang 属性已声明 | P1 |
| TC-061 | "跳到主内容"链接检测 | P2 |
| TC-062 | 聚焦指示器可见 | P1 |
| TC-063 | 响应式设计 (320/768/1920) | P1 |
| TC-064 | 页面标题长度 > 5 字符 | P1 |
| TC-065 | 链接有描述性文本 | P1 |

### 性能 (performance.spec.ts)

| ID | 描述 | 阈值 |
|----|------|------|
| TC-066 | 主页加载时间 | < 3s |
| TC-067 | API 响应时间 | < 2s |
| TC-068 | DOM Content Loaded 性能 | < 5s |
| TC-069 | CSS 文件加载统计 | 日志记录 |
| TC-070 | JS 文件加载统计 | 日志记录 |
| TC-071 | 图片资源总大小 | < 5MB |
| TC-072 | 搜索响应时间 | < 3s |
| TC-073 | JS 堆内存使用 | 日志记录 |
| TC-074 | 3 并发 API 请求 | < 3s |
| TC-075 | 表单填充交互时间 | < 1s |
| TC-076 | Paint Timing 渲染指标 | 日志记录 |
| TC-077 | Navigation Timing 分解 | < 3s |
| TC-078 | TTFB (Time to First Byte) | < 1s |
| TC-079 | 压力测试 (5 次连续加载) | 平均 < 3s |
| TC-080 | 资源缓存有效性 | 日志记录 |

---

## 3. 页面对象模型 (POM)

### 架构

```
BasePage                    # 公共方法: navigateTo, getTitle, waitForElement, 
                            #   isElementVisible, takeScreenshot, acceptCookies
├── HomePage                # 搜索、导航、讨论列表、标签/分类
├── LoginPage               # 登录/记住我/清空表单/错误检查
└── SearchPage              # 搜索/结果/排序/分页/建议
```

### BasePage 公共方法

| 方法 | 用途 |
|------|------|
| `navigateTo(path)` | 导航到路径，等待 load 事件 |
| `getTitle()` | 返回页面标题 |
| `getPageUrl()` | 返回当前 URL |
| `isElementVisible(selector)` | 5s 内检查元素可见性 |
| `getElementText(selector)` | 获取元素文本内容 |
| `getPageMetaDescription()` | 获取 meta description |
| `takeScreenshot(name)` | 保存截图到 screenshots/ |
| `acceptCookies()` | 处理 cookie 同意弹窗 |
| `dismissCookieBanner()` | 关闭 cookie 横幅 |
| `scrollToElement(selector)` | 滚动到元素 |
| `waitForNavigation(action)` | 等待导航完成后继续 |

### TestUtils 静态工具

| 方法 | 用途 |
|------|------|
| `waitForElementVisible(page, selector, timeout)` | 等待元素可见 |
| `fillForm(page, fields)` | 批量填充表单 |
| `captureConsoleLogs(page, callback)` | 捕获控制台日志 |
| `getPerformanceMetrics(page)` | 获取页面性能计时 |
| `retry(fn, maxRetries, delayMs)` | 指数退避重试 |
| `generateTestEmail(prefix)` | 生成唯一测试邮箱 |
| `generateRandomString(length)` | 生成随机字符串 |
| `clearCookies(page)` / `getCookies(page)` | Cookie 管理 |
| `verifyNetworkRequest(page, url, status)` | 验证网络请求 |
| `throttleNetwork(page)` | 模拟网络限速 |

---

## 4. 编写新测试

### 文件模板

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('功能描述', () => {
  test('TC-XXX: 测试名称', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    // Act
    const title = await homePage.getTitle();

    // Assert
    expect(title.length).toBeGreaterThan(0);
  });
});
```

### 选择器优先级

1. `page.getByRole()` / `page.getByLabel()` — 语义选择器
2. `page.getByPlaceholder()` — 占位符
3. `[data-testid="..."]` — 测试 ID
4. CSS 选择器 — 最后手段
5. 避免 XPath 和深层嵌套选择器

### 最佳实践

- 使用 `beforeEach` 设置页面状态，避免测试间依赖
- 使用 `test.skip()` + `isVisible()` 做 precondition 检查（不使用裸 `.catch()`）
- 等待特定状态 (`waitForLoadState('load')`) 而非硬编码延时
- 使用 `TEST_DATA` fixtures 获取测试数据，不硬编码
- 环境变量管理凭证，不写死在代码中

---

## 5. 测试执行

### 本地运行

```bash
npm test                    # 全浏览器并行执行
npm run test:ui             # Playwright Inspector
npm run test:debug          # 调试模式
npm run test:failed         # 仅重跑失败用例
npm run test:e2e            # 仅 E2E 套件
npm run test:api            # 仅 API 套件
npm run test:security       # 仅安全套件
npm run test:performance    # 仅性能套件
npm run test:chromium       # 仅 Chrome
npm run test:report         # 查看 HTML 报告
```

### CI 执行

```bash
# GitHub Actions 自动触发，环境变量通过 Secrets 注入
TEST_USERNAME=${{ secrets.TEST_USERNAME }}
TEST_PASSWORD=${{ secrets.TEST_PASSWORD }}
```

CI 配置: `retries=2`, `workers=3`, `forbidOnly=true`

### 执行周期

| 频率 | 范围 | 触发条件 |
|------|------|---------|
| 每次提交 | 全部测试 | push/PR 到 main/develop |
| 每日 | 全部测试 | UTC 1:00 定时 |
| 发布前 | 完整套件 | 手动触发 (workflow_dispatch) |

---

## 6. 故障排除

| 问题 | 解决方案 |
|------|---------|
| 找不到元素 | 使用 `npm run test:ui` 交互验证选择器；检查 iframe |
| 网络超时 | 增加 `navigationTimeout`；检查目标站点可访问性 |
| 凭证错误 | 验证 `.env` 文件已配置；检查 Secrets |
| 测试随机失败 | 检查是否有竞态条件；使用 `waitForLoadState('load')` |
| 浏览器未找到 | `npx playwright install --with-deps` |
| 内存溢出 | 减少 workers: `--workers=1` |

---

## 7. 成功标准

- P0 用例 100% 通过
- P1 用例 ≥ 95% 通过
- 全量测试执行 < 15 分钟
- CI 稳定运行，无误报
- 文档与代码保持同步

---

## 8. 报告模板

每次执行后应记录：

```markdown
## 执行摘要
- 日期 / 耗时 / 环境
- 总计 / 通过 / 失败 / 跳过 (成功率)
- 按浏览器分解
- 按测试套件分解

## 失败详情
| 测试 | 浏览器 | 错误 | 建议 |

## 性能摘要
| 指标 | 值 | 阈值 | 状态 |
```

参考 `docs/reports/` 中的历史报告。

---

**版本**: 2.0 | **更新**: 2026-05-03
