/**
 * 测试数据和 fixtures
 */

export const TEST_DATA = {
  // 用户数据
  users: {
    valid: {
      username: process.env.TEST_USERNAME || 'testuser',
      password: process.env.TEST_PASSWORD || 'testpass',
      email: 'test@example.com',
    },
    invalid: {
      username: 'nonexistentuser@test.com',
      password: 'wrongpassword123',
    },
    sqlInjection: {
      username: "admin' OR '1'='1",
      password: "' OR '1'='1",
    },
    xssPayloads: [
      '<script>alert("XSS")</script>',
      '"><img src=x onerror="alert(1)">',
      '"><svg onload="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
    ],
  },

  // 搜索数据
  search: {
    validQueries: ['testing', 'automation', 'qa', 'selenium', 'playwright'],
    emptyQuery: '',
    specialCharacters: '@#$%^&*()',
    veryLongQuery: 'a'.repeat(1000),
  },

  // 表单数据
  forms: {
    loginValid: {
      username: 'testuser',
      password: 'testpass123',
    },
    registrationValid: {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
    },
    commentValid: {
      title: 'Test Comment',
      content: 'This is a test comment with some content',
    },
  },

  // 页面 URL
  urls: {
    home: '/',
    login: '/login',
    register: '/register',
    forum: '/forum',
    search: '/search',
    profile: '/profile',
  },

  // API 数据
  api: {
    discussions: {
      title: 'Test Discussion',
      content: 'This is a test discussion',
      category: 'General',
    },
  },

  // 时间相关
  timeout: 30000,
  shortWait: 5000,
  longWait: 60000,
};

// 提取生成函数
export const generateTestData = {
  uniqueEmail: () => `test_${Date.now()}@example.com`,
  uniqueUsername: () => `testuser_${Date.now()}`,
  randomString: (length = 10) => Math.random().toString(36).substring(2, 2 + length),
};

export default TEST_DATA;
