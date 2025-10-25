const Database = require('../src/database/database');

describe('Database Operations', () => {
  let db;

  beforeEach(async () => {
    db = new Database();
    await db.connect();
    await db.initializeTables();
  });

  afterEach(async () => {
    await db.disconnect();
  });

  describe('DB-FindUserByPhone', () => {
    test('应该能够根据手机号查找用户', async () => {
      // 先创建一个用户
      const testUser = {
        phoneNumber: '13800138000',
        id: 'test-user-id'
      };
      await db.createUser(testUser);

      // 测试查找用户
      const foundUser = await db.findUserByPhone('13800138000');
      
      expect(foundUser).toBeDefined();
      expect(foundUser.phoneNumber).toBe('13800138000');
      expect(foundUser.id).toBe('test-user-id');
    });

    test('当用户不存在时应该返回null', async () => {
      const foundUser = await db.findUserByPhone('99999999999');
      expect(foundUser).toBeNull();
    });

    test('应该能处理无效的手机号格式', async () => {
      const foundUser = await db.findUserByPhone('invalid-phone');
      expect(foundUser).toBeNull();
    });
  });

  describe('DB-CreateUser', () => {
    test('应该能够创建新用户', async () => {
      const newUser = {
        phoneNumber: '13800138001',
        id: 'new-user-id',
        password: 'test123456'
      };

      const createdUser = await db.createUser(newUser);
      
      expect(createdUser).toBeDefined();
      expect(createdUser.phoneNumber).toBe('13800138001');
      expect(createdUser.id).toBe('new-user-id');
      expect(createdUser.password).toBe('test123456');
      expect(createdUser.createdAt).toBeDefined();
    });

    test('不应该允许创建重复手机号的用户', async () => {
      const user1 = {
        phoneNumber: '13800138002',
        id: 'user-1',
        password: 'password1'
      };
      const user2 = {
        phoneNumber: '13800138002',
        id: 'user-2',
        password: 'password2'
      };

      await db.createUser(user1);
      
      await expect(db.createUser(user2)).rejects.toThrow();
    });

    test('应该验证必需字段', async () => {
      const invalidUser = {
        id: 'test-id'
        // 缺少 phoneNumber
      };

      await expect(db.createUser(invalidUser)).rejects.toThrow();
    });
  });

  describe('DB-SaveVerificationCode', () => {
    test('应该能够保存验证码', async () => {
      const codeData = {
        phoneNumber: '13800138003',
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5分钟后过期
      };

      const result = await db.saveVerificationCode(codeData);
      
      expect(result).toBeDefined();
      expect(result.phoneNumber).toBe('13800138003');
      expect(result.code).toBe('123456');
      expect(result.expiresAt).toBeDefined();
    });

    test('应该覆盖同一手机号的旧验证码', async () => {
      const phoneNumber = '13800138004';
      
      // 保存第一个验证码
      await db.saveVerificationCode({
        phoneNumber,
        code: '111111',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      // 保存第二个验证码
      await db.saveVerificationCode({
        phoneNumber,
        code: '222222',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      // 验证只有最新的验证码有效
      const isValid = await db.verifyCode(phoneNumber, '222222');
      expect(isValid).toBe(true);

      const isOldValid = await db.verifyCode(phoneNumber, '111111');
      expect(isOldValid).toBe(false);
    });
  });

  describe('DB-VerifyCode', () => {
    test('应该能够验证有效的验证码', async () => {
      const phoneNumber = '13800138005';
      const code = '654321';
      
      await db.saveVerificationCode({
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      const isValid = await db.verifyCode(phoneNumber, code);
      expect(isValid).toBe(true);
    });

    test('应该拒绝过期的验证码', async () => {
      const phoneNumber = '13800138006';
      const code = '999999';
      
      await db.saveVerificationCode({
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() - 1000) // 已过期
      });

      const isValid = await db.verifyCode(phoneNumber, code);
      expect(isValid).toBe(false);
    });

    test('应该拒绝错误的验证码', async () => {
      const phoneNumber = '13800138007';
      
      await db.saveVerificationCode({
        phoneNumber,
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      const isValid = await db.verifyCode(phoneNumber, '654321');
      expect(isValid).toBe(false);
    });

    test('应该拒绝不存在的手机号验证码', async () => {
      const isValid = await db.verifyCode('99999999999', '123456');
      expect(isValid).toBe(false);
    });
  });
});