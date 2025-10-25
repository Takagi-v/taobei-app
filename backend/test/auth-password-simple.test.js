const request = require('supertest');
const app = require('../src/app');
const Database = require('../src/database/database');
const authRoutes = require('../src/routes/auth');

describe('密码登录API简单测试', () => {
  let db;

  beforeEach(async () => {
    // 为每个测试创建新的数据库实例
    db = new Database();
    await db.connect();
    await db.initTables();
    
    // 设置测试环境变量
    process.env.NODE_ENV = 'test';
    
    // 替换auth.js中的数据库实例
    authRoutes.setDatabase(db);
    
    // 验证数据库实例是否正确设置
    const currentDb = authRoutes.getDatabase();
    if (currentDb !== db) {
      throw new Error('Database instance not set correctly');
    }
  });

  afterEach(async () => {
    if (db) {
      await db.disconnect();
    }
  });

  describe('POST /api/auth/register 和 POST /api/auth/login-password', () => {
    test('完整的注册和密码登录流程', async () => {
      const phoneNumber = '13800138001';
      const password = 'test123456';
      
      // 1. 发送验证码
      const codeResponse = await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });
      
      expect(codeResponse.status).toBe(200);
      expect(codeResponse.body.success).toBe(true);
      
      // 2. 注册用户 (使用固定验证码)
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber,
          verificationCode: '123456', // 使用默认验证码
          password,
          confirmPassword: password,
          agreement: true
        });
      
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.token).toBeDefined();
      
      // 3. 使用密码登录
      const loginResponse = await request(app)
        .post('/api/auth/login-password')
        .send({
          phoneNumber,
          password
        });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.token).toBeDefined();
    });

    test('错误的密码应该返回失败', async () => {
      const phoneNumber = '13800138002';
      const password = 'test123456';
      const wrongPassword = 'wrongpassword';
      
      // 1. 发送验证码
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });
      
      // 2. 注册用户
      await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber,
          verificationCode: '123456',
          password,
          confirmPassword: password,
          agreement: true
        });
      
      // 3. 使用错误密码登录
      const loginResponse = await request(app)
        .post('/api/auth/login-password')
        .send({
          phoneNumber,
          password: wrongPassword
        });
      
      expect(loginResponse.status).toBe(400);
      expect(loginResponse.body.success).toBe(false);
      expect(loginResponse.body.message).toContain('密码');
    });

    test('不存在的用户应该返回失败', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login-password')
        .send({
          phoneNumber: '13800138999',
          password: 'test123456'
        });
      
      expect(loginResponse.status).toBe(400);
      expect(loginResponse.body.success).toBe(false);
      expect(loginResponse.body.message).toContain('用户');
    });
  });
});