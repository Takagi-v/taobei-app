const request = require('supertest');
const app = require('./src/app');
const Database = require('./src/database/database');

async function debugRegister() {
  // 设置测试环境
  process.env.NODE_ENV = 'test';
  process.env.DB_PATH = ':memory:';
  
  const db = new Database();
  await db.connect();
  await db.initTables();

  // 保存验证码
  await db.saveVerificationCode({
    phoneNumber: '13800138000',
    code: '123456',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10分钟后过期
  });

  // 注册数据
  const registerData = {
    phoneNumber: '13800138000',
    verificationCode: '123456',
    password: 'test123456',
    confirmPassword: 'test123456',
    agreement: true
  };

  console.log('发送注册请求:', registerData);

  try {
    const response = await request(app)
      .post('/api/auth/register')
      .send(registerData);

    console.log('响应状态:', response.status);
    console.log('响应体:', response.body);
  } catch (error) {
    console.error('请求错误:', error);
  }

  await db.disconnect();
}

debugRegister().catch(console.error);