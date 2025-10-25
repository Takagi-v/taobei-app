const request = require('supertest');
const app = require('../src/app');
const Database = require('../src/database/database');
const authRoutes = require('../src/routes/auth');

describe('Auth Password Tests', () => {
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
  });

  afterEach(async () => {
    if (db) {
      await db.disconnect();
    }
  });

  describe('POST /api/auth/login-password', () => {
    test('应该成功使用密码登录已注册用户', async () => {
      // 先注册一个用户
      const registerData = {
        phoneNumber: '13800138000',
        verificationCode: '123456',
        password: 'test123456',
        confirmPassword: 'test123456',
        agreement: true
      };

      // 保存验证码
      await db.saveVerificationCode({
        phoneNumber: '13800138000',
        code: '123456',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10分钟后过期
      });

      // 注册用户
      await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      // 使用密码登录
      const loginData = {
        phoneNumber: '13800138000',
        password: 'test123456'
      };

      const response = await request(app)
        .post('/api/auth/login-password')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.phoneNumber).toBe('13800138000');
      expect(response.body.data.user.password).toBeUndefined(); // 不应该返回密码
    });

    test('错误的密码应该返回失败', async () => {
      // 先注册一个用户
      const registerData = {
        phoneNumber: '13800138001',
        verificationCode: '123456',
        password: 'test123456',
        confirmPassword: 'test123456',
        agreement: true
      };

      // 保存验证码
      await db.saveVerificationCode({
        phoneNumber: '13800138001',
        code: '123456',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });

      // 注册用户
      await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      // 使用错误密码登录
      const loginData = {
        phoneNumber: '13800138001',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login-password')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('用户名或密码错误');
    });

    test('不存在的用户应该返回失败', async () => {
      const loginData = {
        phoneNumber: '13800138999',
        password: 'test123456'
      };

      const response = await request(app)
        .post('/api/auth/login-password')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('用户名或密码错误');
    });

    test('缺少必填字段应该返回错误', async () => {
      // 缺少密码
      let response = await request(app)
        .post('/api/auth/login-password')
        .send({ phoneNumber: '13800138000' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('手机号和密码不能为空');

      // 缺少手机号
      response = await request(app)
        .post('/api/auth/login-password')
        .send({ password: 'test123456' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('手机号和密码不能为空');
    });

    test('无效的手机号格式应该返回错误', async () => {
      const loginData = {
        phoneNumber: 'invalid-phone',
        password: 'test123456'
      };

      const response = await request(app)
        .post('/api/auth/login-password')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('手机号格式不正确');
    });

    test('空字符串字段应该被视为缺少字段', async () => {
      const loginData = {
        phoneNumber: '',
        password: ''
      };

      const response = await request(app)
        .post('/api/auth/login-password')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('手机号和密码不能为空');
    });
  });
});