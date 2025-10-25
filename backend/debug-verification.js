const Database = require('./src/database/database');

async function debugVerification() {
  // 设置测试环境
  process.env.NODE_ENV = 'test';
  process.env.DB_PATH = ':memory:';
  
  const db = new Database();
  await db.connect();
  await db.initTables();

  console.log('保存验证码...');
  
  // 保存验证码
  const codeData = {
    phoneNumber: '13800138000',
    code: '123456',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10分钟后过期
  };
  
  await db.saveVerificationCode(codeData);
  console.log('验证码已保存:', codeData);

  // 查询验证码表
  const codes = await new Promise((resolve, reject) => {
    db.db.all('SELECT * FROM verification_codes', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  
  console.log('数据库中的验证码:', codes);

  // 验证验证码
  console.log('验证验证码...');
  const isValid = await db.verifyCode('13800138000', '123456');
  console.log('验证结果:', isValid);

  await db.disconnect();
}

debugVerification().catch(console.error);