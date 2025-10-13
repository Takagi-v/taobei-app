const express = require('express');
const jwt = require('jsonwebtoken');
const Database = require('../database/database');

const router = express.Router();
const db = new Database();

// 初始化数据库连接
(async () => {
  try {
    await db.connect();
    await db.initTables();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
})();

// 验证码发送频率限制（内存存储，生产环境应使用Redis）
const sendCodeLimits = new Map();

// 手机号格式验证
function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

// 生成6位验证码
function generateVerificationCode() {
  // 在测试环境中使用固定验证码
  if (process.env.NODE_ENV === 'test') {
    return '123456';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 生成JWT令牌
function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '24h' });
}

// API-POST-SendVerificationCode 接口实现
router.post('/send-verification-code', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // 校验手机号是否为空
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    // 校验手机号格式
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 检查发送频率限制
    const now = Date.now();
    const lastSent = sendCodeLimits.get(phoneNumber);
    if (lastSent && now - lastSent < 60000) { // 60秒限制
      return res.status(429).json({
        success: false,
        message: '发送过于频繁，请稍后再试'
      });
    }

    // 生成6位验证码
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60秒后过期

    // 保存验证码到数据库
    await db.saveVerificationCode({
      phoneNumber,
      code: verificationCode,
      expiresAt
    });

    // 打印验证码到控制台（模拟发送短信）
    console.log(`验证码发送到 ${phoneNumber}: ${verificationCode}`);

    // 记录发送时间
    sendCodeLimits.set(phoneNumber, now);

    res.status(200).json({
      success: true,
      message: '验证码发送成功',
      expiresIn: 60
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// API-POST-Login 接口实现
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    
    // 校验必需字段
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

    // 校验手机号是否已注册
    const user = await db.findUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在，请先注册'
      });
    }

    // 校验验证码是否正确
    const isCodeValid = await db.verifyCode(phoneNumber, verificationCode);
    if (!isCodeValid) {
      return res.status(401).json({
        success: false,
        message: '验证码错误或已过期'
      });
    }

    // 生成JWT令牌
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// API-POST-Register 接口实现
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, verificationCode, agreeToTerms } = req.body;
    
    // 校验必需字段
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

    // 校验验证码是否正确
    const isCodeValid = await db.verifyCode(phoneNumber, verificationCode);
    if (!isCodeValid) {
      return res.status(401).json({
        success: false,
        message: '验证码错误或已过期'
      });
    }

    // 校验手机号是否已注册
    const existingUser = await db.findUserByPhone(phoneNumber);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '用户已存在，请直接登录'
      });
    }

    // 创建新用户
    const newUser = await db.createUser({ phoneNumber });

    // 生成JWT令牌
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: newUser.id,
          phoneNumber: newUser.phoneNumber
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;