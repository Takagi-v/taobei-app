const express = require('express');
const Database = require('../database/database');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 创建默认数据库实例
let db = new Database();

// 初始化数据库连接（非测试环境）
if (process.env.NODE_ENV !== 'test') {
  db.connect().then(() => {
    console.log('Auth routes: Database connected');
  }).catch(err => {
    console.error('Auth routes: Database connection failed:', err);
  });
}

// 允许外部设置数据库实例（用于测试）
router.setDatabase = (database) => {
  if (database && typeof database.connect === 'function') {
    db = database;
  }
};

// 获取当前数据库实例
router.getDatabase = () => {
  return db;
};

// 手机号格式验证
function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

// 生成JWT token
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
}

// 发送验证码接口
router.post('/send-verification-code', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // 验证手机号
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 生成6位数验证码
    let verificationCode;
    if (process.env.NODE_ENV === 'test') {
      // 测试环境使用固定验证码
      verificationCode = '123456';
    } else {
      // 生产环境使用随机验证码
      verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // 设置过期时间（5分钟）
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 保存验证码到数据库
    await db.saveVerificationCode({
      phoneNumber,
      code: verificationCode,
      expiresAt
    });

    // 在实际项目中，这里应该调用短信服务发送验证码
    // 这里只是模拟发送
    console.log(`验证码已发送到 ${phoneNumber}: ${verificationCode}`);

    res.json({
      success: true,
      message: '验证码发送成功'
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败'
    });
  }
});

// 验证码登录接口
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;

    if (!phoneNumber || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: '手机号和验证码不能为空'
      });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 验证验证码
    const isValidCode = await db.verifyCode(phoneNumber, verificationCode);
    if (!isValidCode) {
      return res.status(401).json({
        success: false,
        message: '验证码错误或已过期'
      });
    }

    // 查找或创建用户
    let user = await db.findUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 生成token
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber
        }
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

// 密码登录接口
router.post('/login-password', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // 验证必填字段
    if (!phoneNumber || !password || phoneNumber.trim() === '' || password.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '手机号和密码不能为空'
      });
    }

    // 验证手机号格式
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 验证用户密码
    const user = await db.verifyPassword(phoneNumber, password);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成token
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber
        }
      }
    });
  } catch (error) {
    console.error('密码登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, verificationCode, password, confirmPassword, agreement } = req.body;

    // 验证必填字段
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: '验证码不能为空'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '密码不能为空'
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '确认密码不能为空'
      });
    }

    if (!agreement) {
      return res.status(400).json({
        success: false,
        message: '请同意用户协议'
      });
    }

    // 验证手机号格式
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 验证密码
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度不能少于6位'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '两次输入的密码不一致'
      });
    }

    // 验证验证码
    const isValidCode = await db.verifyCode(phoneNumber, verificationCode);
    if (!isValidCode) {
      return res.status(401).json({
        success: false,
        message: '验证码错误或已过期'
      });
    }

    // 检查用户是否已存在
    const existingUser = await db.findUserByPhone(phoneNumber);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '该手机号已注册'
      });
    }

    // 创建用户
    const user = await db.createUser({
      phoneNumber,
      password
    });

    // 生成token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber
        }
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    if (error.message === 'User with this phone number already exists') {
      res.status(409).json({
        success: false,
        message: '该手机号已注册'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '注册失败'
      });
    }
  }
});

module.exports = router;