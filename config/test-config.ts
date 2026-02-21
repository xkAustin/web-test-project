/**
 * 测试环境配置
 */

export const TEST_CONFIG = {
  // 基础 URL
  baseURL: process.env.BASE_URL || 'https://www.wangdanatest.top',

  // 测试凭证
  testUser: {
    username: process.env.TEST_USERNAME || 'testuser',
    password: process.env.TEST_PASSWORD || 'testpass',
  },

  // 超时设置 (毫秒)
  timeouts: {
    default: 30000,
    short: 5000,
    long: 60000,
  },

  // 浏览器设置
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
  },

  // 日志级别
  logLevel: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',

  // 重试次数
  retries: process.env.CI ? 2 : 0,

  // 并行工作线程
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : undefined,

  // 报告设置
  report: {
    outputDir: 'reports/html',
    resultsFile: 'reports/test-results.json',
  },

  // 屏幕截图和视频
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',

  // API 端点
  api: {
    discussions: '/api/discussions',
    tags: '/api/tags',
    categories: '/api/categories',
    search: '/api/search',
  },

  // 等待策略
  waitStrategy: {
    navigation: 'networkidle',
    element: 5000,
  },
};

// 选择器配置（可选）
export const SELECTORS = {
  // 导航
  nav: {
    logo: 'a[href="/"]',
    loginBtn: 'a:has-text("登录"), button:has-text("Login")',
    registerBtn: 'a:has-text("注册"), button:has-text("Register")',
  },

  // 搜索
  search: {
    input: 'input[placeholder*="Search"], input[placeholder*="搜索"]',
    button: 'button:has-text("Search"), button:has-text("搜索")',
    results: '.search-results, [class*="results"]',
  },

  // 登录表单
  login: {
    username: 'input[name="username"], input[type="text"]',
    password: 'input[name="password"], input[type="password"]',
    submit: 'button[type="submit"], button:has-text("登录")',
    error: '.error-message, .toast, .alert-danger',
  },

  // 内容
  content: {
    header: 'header',
    footer: 'footer',
    main: 'main, [role="main"]',
  },
};

export default TEST_CONFIG;
