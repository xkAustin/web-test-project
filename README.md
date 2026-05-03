# wangdanatest.top 自动化测试

企业级 Playwright 测试框架，覆盖 [wangdanatest.top](https://www.wangdanatest.top) 全站功能、API、安全、性能和可访问性测试。

## 快览

| 指标 | 数量 |
|------|------|
| 测试用例 | 106 |
| 规范文件 | 11 (e2e × 6, api × 1, security × 3, performance × 1) |
| 页面对象 | 4 (BasePage, HomePage, LoginPage, SearchPage) |
| 浏览器 | 5 (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari) |
| 测试类型 | 5 (E2E, API, Security, Performance, Accessibility) |

## 快速开始

```bash
npm ci                                # 安装依赖
npx playwright install --with-deps    # 安装浏览器
cp .env.example .env                  # 配置凭证（编辑 TEST_USERNAME/TEST_PASSWORD）
bash scripts/check-env.sh             # 验证环境
npm test                              # 运行全部测试
```

## 项目结构

```
├── tests/
│   ├── e2e/            # 端到端测试 (home, login, search, registration, about, edge_cases)
│   ├── api/            # 论坛 API 测试 (forum_api)
│   ├── security/       # 安全测试 (xss, csrf, accessibility)
│   ├── performance/    # 性能基准测试
│   ├── pages/          # 页面对象模型 (BasePage, HomePage, LoginPage, SearchPage)
│   ├── utils/          # 工具类 (TestUtils)
│   └── fixtures/       # 测试数据 (test-data)
├── config/             # 扩展配置 (test-config)
├── scripts/            # 自动化脚本 (check-env, generate-report)
├── docs/               # 文档 (TEST_SPECIFICATION, DOCKER_GUIDE, reports/)
├── .github/workflows/  # CI/CD (test.yml, ci.yml)
├── playwright.config.ts
├── Dockerfile
└── docker-compose.yml
```

## 测试类型

| 类型 | 命令 | 覆盖范围 |
|------|------|---------|
| E2E | `npm run test:e2e` | 主页加载、登录认证、搜索、注册、论坛交互、边界情况 |
| API | `npm run test:api` | /api/discussions, /api/tags, 响应头, CORS, 限流 |
| 安全 | `npm run test:security` | XSS (10), CSRF (10), 可访问性 WCAG 2.0 AA (15) |
| 性能 | `npm run test:performance` | 加载时间, TTFB, 并发请求, 内存, 渲染性能 |
| 移动端 | `npm run test:mobile` | Mobile Chrome + Mobile Safari |

## 常用命令

```bash
npm test                   # 全部测试
npm run test:ui            # UI 交互模式
npm run test:debug         # 调试模式
npm run test:chromium      # 仅 Chrome
npm run test:firefox       # 仅 Firefox
npm run test:webkit        # 仅 Safari
npm run test:e2e           # E2E 套件
npm run test:api           # API 套件
npm run test:security      # 安全套件
npm run test:performance   # 性能套件
npm run test:mobile        # 移动端测试
npm run test:failed        # 仅重跑失败用例
npm run test:report        # 查看 HTML 报告
npm run lint               # ESLint 检查
npm run format             # Prettier 格式化
```

## Docker

```bash
docker build -t wangdanatest-automation .
docker run --rm -v $(pwd)/reports:/app/reports wangdanatest-automation npm test
docker-compose up                          # 运行测试
docker-compose --profile reporter up       # 测试 + HTML 报告 (localhost:8080)
docker-compose --profile debug run playwright-debug  # 交互式调试
```

详见 [Docker 完整指南](docs/DOCKER_GUIDE.md)。

## 持续集成

GitHub Actions 已配置自动测试执行：push/PR 触发（main, develop），每日 UTC 1:00 定时运行，包含安全审计和 Docker 镜像构建。

所需 Secrets: `TEST_USERNAME`, `TEST_PASSWORD`

## 文档

- [测试规范](docs/TEST_SPECIFICATION.md) — 测试计划、用例清单、编写指南、POM 参考、故障排除
- [Docker 指南](docs/DOCKER_GUIDE.md) — 容器化运行完整说明
- [贡献指南](CONTRIBUTING.md) — 代码风格、提交规范、PR 流程

## 贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.md)。简略流程：

```bash
git checkout -b feature/your-feature
# 编写代码和测试...
git commit -m 'feat: description'
git push origin feature/your-feature
# 创建 Pull Request
```

## 许可证

MIT — 详见 [LICENSE](LICENSE)

---

**版本**: 1.0.0 | **维护**: QA Team
