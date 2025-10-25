# 用户认证系统

## 项目简介

这是一个基于 Node.js 和 React 的完整用户认证系统，实现了用户注册、登录、验证码验证等核心功能。项目采用前后端分离架构，提供了完整的 API 接口和现代化的用户界面。

## 核心功能

- 📱 **手机号注册/登录**：支持手机号码格式验证
- 🔐 **验证码验证**：短信验证码发送与验证（测试环境使用固定验证码）
- 🔑 **密码登录**：支持密码登录方式
- 🛡️ **JWT 认证**：基于 JSON Web Token 的身份验证
- 📊 **数据持久化**：SQLite 数据库存储用户信息
- ✅ **完整测试**：包含单元测试和集成测试

## 技术栈

### 后端技术
- **运行环境**：Node.js 16+
- **Web框架**：Express.js
- **数据库**：SQLite3
- **身份验证**：JWT (jsonwebtoken)
- **测试框架**：Jest + Supertest
- **开发工具**：Nodemon

### 前端技术
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：CSS3 + 现代化UI设计
- **测试**：Jest + React Testing Library
- **开发服务器**：Vite Dev Server

### 数据库设计
- **users 表**：存储用户基本信息（ID、手机号、密码、创建时间）
- **verification_codes 表**：存储验证码信息（手机号、验证码、过期时间、使用状态）

## 项目结构

```
test/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── app.js          # Express 应用入口
│   │   ├── database/       # 数据库模块
│   │   │   └── database.js # SQLite 数据库操作
│   │   └── routes/         # API 路由
│   │       └── auth.js     # 认证相关 API
│   ├── test/               # 后端测试
│   │   ├── database.test.js
│   │   ├── auth.test.js
│   │   └── auth-password-simple.test.js
│   ├── package.json        # 后端依赖配置
│   └── .env.example        # 环境变量示例
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── App.tsx         # 主应用组件
│   │   ├── main.tsx        # 应用入口
│   │   ├── components/     # React 组件
│   │   └── styles/         # 样式文件
│   ├── test/               # 前端测试
│   ├── package.json        # 前端依赖配置
│   └── vite.config.ts      # Vite 配置
└── README.md               # 项目说明文档
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 1. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 启动后端服务

```bash
cd backend

# 开发模式（推荐）
npm run dev

# 生产模式
npm start
```

后端服务运行在：`http://localhost:3000`

### 3. 启动前端应用

```bash
cd frontend

# 启动开发服务器
npm run dev
```

前端应用运行在：`http://localhost:5173`

## 测试指南

### 后端测试

```bash
cd backend

# 运行所有测试（推荐）
npm test

# 运行特定测试文件
npm test -- test/database.test.js
npm test -- test/routes/auth.test.js
npm test -- test/auth-password-simple.test.js
```

**测试覆盖范围：**
- 数据库操作（用户创建、验证码存储、验证等）
- API 接口（注册、登录、验证码发送）
- 错误处理和边界条件
- 身份验证和授权

**测试特点：**
- 使用内存数据库，测试隔离
- 串行执行，避免并发冲突
- 测试环境使用固定验证码 `123456`

### 前端测试

```bash
cd frontend

# 运行前端测试
npm test
```

## API 接口

### 基础信息
- **Base URL**: `http://localhost:3000/api/auth`
- **Content-Type**: `application/json`

### 接口列表

#### 发送验证码
```http
POST /send-verification-code
{
  "phoneNumber": "13800138000"
}
```

#### 用户注册
```http
POST /register
{
  "phoneNumber": "13800138000",
  "verificationCode": "123456",
  "password": "password123",
  "confirmPassword": "password123",
  "agreement": true
}
```

#### 验证码登录
```http
POST /login
{
  "phoneNumber": "13800138000",
  "verificationCode": "123456"
}
```

#### 密码登录
```http
POST /login-password
{
  "phoneNumber": "13800138000",
  "password": "password123"
}
```

## 开发说明

### 验证码机制
- **测试环境**：使用固定验证码 `123456`
- **生产环境**：生成 6 位随机数字验证码
- **有效期**：5 分钟
- **使用限制**：生产环境一次性使用，测试环境可重复使用

### 数据库
- **开发环境**：SQLite 文件数据库 (`backend/database.sqlite`)
- **测试环境**：内存数据库，每个测试独立实例

### 环境配置
在 `backend` 目录创建 `.env` 文件：
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secure-secret-key
DB_PATH=./database.sqlite
```

## 故障排除

### 常见问题
1. **端口占用**：检查 3000 和 5173 端口是否被占用
2. **依赖问题**：删除 `node_modules` 重新安装
3. **数据库错误**：删除 `backend/database.sqlite` 重新启动
4. **测试失败**：确保 Node.js 版本符合要求

### 开发建议
- 遵循现有代码风格和规范
- 新功能开发前编写测试用例
- 保持 API 接口的 RESTful 设计
- 完善错误处理和用户体验