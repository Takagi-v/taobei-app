const request = require('supertest');
const app = require('../../src/app');

describe('Authentication API', () => {
  describe('POST /api/auth/send-verification-code', () => {
    test('应该成功发送验证码到有效手机号', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '13800138000'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('验证码发送成功');
    });

    test('应该拒绝无效的手机号格式', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: 'invalid-phone'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('手机号格式不正确');
    });

    test('应该拒绝空的手机号', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('手机号不能为空');
    });

    test('应该限制同一手机号的发送频率', async () => {
      const phoneNumber = '13800138001';
      
      // 第一次发送
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });

      // 立即再次发送
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });

      expect(response.status).toBe(429);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('发送过于频繁');
    });
  });

  describe('POST /api/auth/login', () => {
    test('应该成功登录有效用户', async () => {
      const phoneNumber = '13800138002';
      const verificationCode = '123456';

      // 先注册用户
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });

      await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber,
          verificationCode: '123456'
        });

      // 再次发送验证码用于登录
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber,
          verificationCode
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.phoneNumber).toBe(phoneNumber);
    });

    test('应该拒绝错误的验证码', async () => {
      const phoneNumber = '13800138003';
      
      // 先注册用户
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });

      await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber,
          verificationCode: '123456'
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber,
          verificationCode: 'wrong-code'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('验证码错误或已过期');
    });

    test('应该拒绝不存在的用户', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '99999999999',
          verificationCode: '123456'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('用户不存在');
    });

    test('应该验证必需字段', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '13800138004'
          // 缺少 verificationCode
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('验证码不能为空');
    });
  });

  describe('POST /api/auth/register', () => {
    test('应该成功注册新用户', async () => {
      const phoneNumber = '13800138005';
      const verificationCode = '123456';

      // 先发送验证码
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber,
          verificationCode
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.phoneNumber).toBe(phoneNumber);
      expect(response.body.data.user.id).toBeDefined();
    });

    test('应该拒绝已存在的用户注册', async () => {
      const phoneNumber = '13800138006';
      
      // 先注册一次
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });
      
      await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber,
          verificationCode: '123456'
        });

      // 再次尝试注册
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({ phoneNumber });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber,
          verificationCode: '123456'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('用户已存在');
    });

    test('应该拒绝错误的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '13800138007',
          verificationCode: 'wrong-code'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('验证码错误或已过期');
    });

    test('应该验证必需字段', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          verificationCode: '123456'
          // 缺少 phoneNumber
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('手机号不能为空');
    });

    test('应该生成唯一的用户ID', async () => {
      const phoneNumbers = ['13800138008', '13800138009'];
      const users = [];

      for (const phoneNumber of phoneNumbers) {
        await request(app)
          .post('/api/auth/send-verification-code')
          .send({ phoneNumber });

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            phoneNumber,
            verificationCode: '123456'
          });

        users.push(response.body.data.user);
      }

      expect(users[0].id).not.toBe(users[1].id);
      expect(users[0].id).toBeDefined();
      expect(users[1].id).toBeDefined();
    });
  });
});