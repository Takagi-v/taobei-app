# 当前所有文件夹下的readme供测试使用，并非最终版本，最终版本将整合需求变更与用户提示词变动后提交


# 用户认证系统 - 部署和测试指南

## 项目概述

这是一个完整的用户认证系统，包含后端API和前端界面，支持用户注册、登录、验证码验证等功能。

## 项目结构

```
test/
├── backend/          # 后端API服务
│   ├── src/         # 源代码
│   │   ├── app.js   # 应用入口
│   │   ├── database/ # 数据库相关
│   │   └── routes/  # API路由
│   └── test/        # 测试文件
├── frontend/        # 前端应用
│   ├── src/         # 源代码
│   └── test/        # 前端测试
└── README.md        # 本文件
```

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

## 快速开始

### 1. 克隆项目并安装依赖

```bash
# 进入项目目录
cd test

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 启动后端服务

```bash
# 在 backend 目录下
cd backend

# 开发模式启动（推荐）
npm run dev

# 或者生产模式启动
npm start
```

后端服务将在 `http://localhost:3000` 启动

### 3. 启动前端服务

```bash
# 在 frontend 目录下
cd frontend

# 启动开发服务器
npm run dev
```

前端应用将在 `http://localhost:5173` 启动

## 测试指南

### 后端测试

后端包含完整的API测试套件，测试覆盖：
- 数据库操作测试
- 用户注册和登录API测试
- 验证码发送和验证测试
- 密码登录测试

```bash
# 进入后端目录
cd backend

# 运行所有测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 运行特定测试文件
npm test -- test/database.test.js
npm test -- test/routes/auth.test.js
npm test -- test/auth-password.test.js
npm test -- test/auth-password-simple.test.js
```

#### 测试说明

- **测试配置**: 使用Jest作为测试框架，配置了串行执行（`maxWorkers: 1`）以避免数据库冲突
- **数据库**: 每个测试都使用独立的SQLite内存数据库实例
- **测试覆盖**: 包含正常流程和异常情况的测试用例

### 前端测试

```bash
# 进入前端目录
cd frontend

# 运行前端测试
npm test
```

## API接口文档

### 基础URL
```
http://localhost:3000/api/auth
```

### 接口列表

#### 1. 发送验证码
```http
POST /send-verification-code
Content-Type: application/json

{
  "phoneNumber": "13800138000"
}
```

#### 2. 用户注册
```http
POST /register
Content-Type: application/json

{
  "phoneNumber": "13800138000",
  "verificationCode": "123456",
  "password": "password123",
  "confirmPassword": "password123",
  "agreement": true
}
```

#### 3. 验证码登录
```http
POST /login
Content-Type: application/json

{
  "phoneNumber": "13800138000",
  "verificationCode": "123456"
}
```

#### 4. 密码登录
```http
POST /login-password
Content-Type: application/json

{
  "phoneNumber": "13800138000",
  "password": "password123"
}
```

## 开发环境配置

### 后端环境变量

在 `backend` 目录下创建 `.env` 文件：

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-here
DB_PATH=./database.sqlite
```

### 数据库

- **开发环境**: 使用SQLite数据库，文件位于 `backend/database.sqlite`
- **测试环境**: 使用内存数据库，每个测试独立创建

## 故障排除

### 常见问题

1. **端口冲突**
   - 后端默认端口3000，前端默认端口5173
   - 如果端口被占用，可以修改配置或停止占用端口的进程

2. **数据库问题**
   - 如果遇到数据库错误，删除 `backend/database.sqlite` 文件重新启动

3. **依赖安装问题**
   - 清除缓存：`npm cache clean --force`
   - 删除 `node_modules` 重新安装：`rm -rf node_modules && npm install`

4. **测试失败**
   - 确保没有其他进程占用数据库
   - 检查Node.js版本是否符合要求

### 测试环境说明

- 测试使用固定验证码 `123456`
- 测试数据库为内存数据库，测试结束后自动清理
- 所有测试串行执行，避免并发冲突

## 开发建议

1. **代码规范**: 遵循项目现有的代码风格
2. **测试驱动**: 新功能开发前先编写测试用例
3. **API设计**: 保持RESTful API设计原则
4. **错误处理**: 完善的错误处理和用户友好的错误信息

## 技术栈

### 后端
- Node.js + Express.js
- SQLite3 数据库
- JWT 身份验证
- Jest 测试框架

### 前端
- React + TypeScript
- Vite 构建工具
- 现代化UI组件

## 联系方式

如有问题，请联系项目维护者或提交Issue。