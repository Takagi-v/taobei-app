# 后端API服务 - 部署和测试指南

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动服务
```bash
# 开发模式（推荐）
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3000` 启动

## 测试

### 运行所有测试
```bash
npm test
```

### 运行特定测试
```bash
# 数据库测试
npm test -- test/database.test.js

# 认证API测试
npm test -- test/routes/auth.test.js

# 密码登录测试
npm test -- test/auth-password.test.js

# 简单密码登录测试
npm test -- test/auth-password-simple.test.js
```

### 测试监听模式
```bash
npm run test:watch
```

## 环境配置

创建 `.env` 文件：
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-here
DB_PATH=./database.sqlite
```

## API接口

### 基础URL
```
http://localhost:3000/api/auth
```

### 接口列表
- `POST /send-verification-code` - 发送验证码
- `POST /register` - 用户注册
- `POST /login` - 验证码登录
- `POST /login-password` - 密码登录

详细接口文档请参考项目根目录的 README.md

## 测试说明

- 使用Jest测试框架
- 测试配置为串行执行（避免数据库冲突）
- 每个测试使用独立的内存数据库
- 测试覆盖率包含所有核心功能