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
  console.log('=== 发送验证码接口开始 ===');
  console.log('请求时间:', new Date().toISOString());
  console.log('请求体:', req.body);
  
  try {
    const { phoneNumber } = req.body;
    console.log('步骤1: 提取手机号 -', phoneNumber);
    
    // 校验手机号是否为空
    if (!phoneNumber) {
      console.log('步骤2: 手机号为空，返回错误');
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    // 校验手机号格式
    console.log('步骤2: 校验手机号格式');
    if (!isValidPhoneNumber(phoneNumber)) {
      console.log('步骤2: 手机号格式不正确，返回错误');
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }
    console.log('步骤2: 手机号格式正确');

    // 检查发送频率限制
    console.log('步骤3: 检查发送频率限制');
    const now = Date.now();
    const lastSent = sendCodeLimits.get(phoneNumber);
    console.log('上次发送时间:', lastSent ? new Date(lastSent).toISOString() : '无');
    if (lastSent && now - lastSent < 60000) { // 60秒限制
      console.log('步骤3: 发送过于频繁，返回错误');
      return res.status(429).json({
        success: false,
        message: '发送过于频繁，请稍后再试'
      });
    }
    console.log('步骤3: 频率检查通过');

    // 生成6位验证码
    console.log('步骤4: 生成验证码');
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60秒后过期
    console.log('生成的验证码:', verificationCode);
    console.log('过期时间:', expiresAt.toISOString());

    // 保存验证码到数据库
    console.log('步骤5: 保存验证码到数据库');
    await db.saveVerificationCode({
      phoneNumber,
      code: verificationCode,
      expiresAt
    });
    console.log('步骤5: 验证码保存成功');

    // 打印验证码到控制台（模拟发送短信）
    console.log(`📱 验证码发送到 ${phoneNumber}: ${verificationCode}`);

    // 记录发送时间
    console.log('步骤6: 记录发送时间');
    sendCodeLimits.set(phoneNumber, now);

    console.log('步骤7: 返回成功响应');
    res.status(200).json({
      success: true,
      message: '验证码发送成功',
      expiresIn: 60
    });
    console.log('=== 发送验证码接口结束 ===\n');
  } catch (error) {
    console.error('❌ 发送验证码错误:', error);
    console.log('=== 发送验证码接口异常结束 ===\n');
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// API-POST-Login 接口实现
router.post('/login', async (req, res) => {
  console.log('=== 登录接口开始 ===');
  console.log('请求时间:', new Date().toISOString());
  console.log('请求体:', req.body);
  
  try {
    const { phoneNumber, verificationCode } = req.body;
    console.log('步骤1: 提取登录参数 - 手机号:', phoneNumber, '验证码:', verificationCode);
    
    // 校验必需字段
    if (!phoneNumber) {
      console.log('步骤2: 手机号为空，返回错误');
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    if (!verificationCode) {
      console.log('步骤2: 验证码为空，返回错误');
      return res.status(400).json({
        success: false,
        message: '验证码不能为空'
      });
    }
    console.log('步骤2: 必需字段校验通过');

    // 校验手机号是否已注册
    console.log('步骤3: 查找用户');
    const user = await db.findUserByPhone(phoneNumber);
    console.log('步骤3: 用户查找结果:', user ? '用户存在' : '用户不存在');
    if (!user) {
      console.log('步骤3: 用户不存在，返回错误');
      return res.status(404).json({
        success: false,
        message: '用户不存在，请先注册'
      });
    }

    // 校验验证码是否正确
    console.log('步骤4: 验证验证码');
    const isCodeValid = await db.verifyCode(phoneNumber, verificationCode);
    console.log('步骤4: 验证码验证结果:', isCodeValid ? '有效' : '无效');
    if (!isCodeValid) {
      console.log('步骤4: 验证码无效，返回错误');
      return res.status(401).json({
        success: false,
        message: '验证码错误或已过期'
      });
    }

    // 生成JWT令牌
    console.log('步骤5: 生成JWT令牌');
    const token = generateToken(user.id);
    console.log('步骤5: JWT令牌生成成功');

    console.log('步骤6: 返回登录成功响应');
    const responseData = {
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber
        }
      }
    };
    console.log('响应数据:', responseData);
    
    res.status(200).json(responseData);
    console.log('=== 登录接口结束 ===\n');
  } catch (error) {
    console.error('❌ 登录错误:', error);
    console.log('=== 登录接口异常结束 ===\n');
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// API-POST-Register 接口实现
router.post('/register', async (req, res) => {
  console.log('=== 注册接口开始 ===');
  console.log('请求时间:', new Date().toISOString());
  console.log('请求体:', req.body);
  
  try {
    const { phoneNumber, verificationCode, password, confirmPassword, agreeToTerms } = req.body;
    console.log('步骤1: 提取注册参数 - 手机号:', phoneNumber, '验证码:', verificationCode, '密码:', password ? '已提供' : '未提供', '确认密码:', confirmPassword ? '已提供' : '未提供');
    
    // 校验必需字段
    if (!phoneNumber) {
      console.log('步骤2: 手机号为空，返回错误');
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    if (!verificationCode) {
      console.log('步骤2: 验证码为空，返回错误');
      return res.status(400).json({
        success: false,
        message: '验证码不能为空'
      });
    }

    if (!password) {
      console.log('步骤2: 密码为空，返回错误');
      return res.status(400).json({
        success: false,
        message: '密码不能为空'
      });
    }

    if (!confirmPassword) {
      console.log('步骤2: 确认密码为空，返回错误');
      return res.status(400).json({
        success: false,
        message: '确认密码不能为空'
      });
    }

    if (password !== confirmPassword) {
      console.log('步骤2: 密码不匹配，返回错误');
      return res.status(400).json({
        success: false,
        message: '两次输入的密码不一致'
      });
    }

    // 密码强度验证
    if (password.length < 6) {
      console.log('步骤2: 密码长度不足，返回错误');
      return res.status(400).json({
        success: false,
        message: '密码长度至少6位'
      });
    }
    console.log('步骤2: 必需字段校验通过');

    // 校验验证码是否正确
    console.log('步骤3: 验证验证码');
    const isCodeValid = await db.verifyCode(phoneNumber, verificationCode);
    console.log('步骤3: 验证码验证结果:', isCodeValid ? '有效' : '无效');
    if (!isCodeValid) {
      console.log('步骤3: 验证码无效，返回错误');
      return res.status(401).json({
        success: false,
        message: '验证码错误或已过期'
      });
    }

    // 校验手机号是否已注册
    console.log('步骤4: 检查用户是否已存在');
    const existingUser = await db.findUserByPhone(phoneNumber);
    console.log('步骤4: 用户检查结果:', existingUser ? '用户已存在' : '用户不存在');
    if (existingUser) {
      console.log('步骤4: 用户已存在，返回错误');
      return res.status(409).json({
        success: false,
        message: '用户已存在，请直接登录'
      });
    }

    // 创建新用户
    console.log('步骤5: 创建新用户');
    const newUser = await db.createUser({ phoneNumber, password });
    console.log('步骤5: 用户创建成功，用户ID:', newUser.id);

    // 生成JWT令牌
    console.log('步骤6: 生成JWT令牌');
    const token = generateToken(newUser.id);
    console.log('步骤6: JWT令牌生成成功');

    console.log('步骤7: 返回注册成功响应');
    const responseData = {
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: newUser.id,
          phoneNumber: newUser.phoneNumber
        }
      }
    };
    console.log('响应数据:', responseData);
    
    res.status(201).json(responseData);
    console.log('=== 注册接口结束 ===\n');
  } catch (error) {
    console.error('❌ 注册错误:', error);
    console.log('=== 注册接口异常结束 ===\n');
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;