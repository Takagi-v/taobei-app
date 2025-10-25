# 项目部署指南

## 环境准备

### 系统要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git（用于克隆项目）

### 检查环境
```bash
node --version
npm --version
```

## 部署步骤

### 1. 获取项目代码
```bash
# 如果是从Git仓库克隆
git clone <repository-url>
cd test

# 或者直接解压项目文件到目录
```

### 2. 后端部署

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建环境配置文件
cp .env.example .env

# 编辑 .env 文件，设置必要的环境变量
# NODE_ENV=production
# PORT=3000
# JWT_SECRET=your-very-secure-secret-key
# DB_PATH=./database.sqlite

# 启动服务
npm start
```

### 3. 前端部署

```bash
# 进入前端目录
cd ../frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 启动开发服务器（开发环境）
npm run dev

# 或者使用静态文件服务器部署构建后的文件
```

## 测试验证

### 后端测试
```bash
cd backend
npm test
```

预期结果：
```
Test Suites: 4 passed, 4 total
Tests:       34 passed, 34 total
Snapshots:   0 total
```

### 前端测试
```bash
cd frontend
npm test
```

### 服务验证

1. **后端服务检查**
   ```bash
   curl http://localhost:3000/api/auth/send-verification-code \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber":"13800138000"}'
   ```

2. **前端应用检查**
   - 访问 `http://localhost:5173`
   - 检查页面是否正常加载

## 生产环境部署

### 使用PM2（推荐）

```bash
# 安装PM2
npm install -g pm2

# 启动后端服务
cd backend
pm2 start src/app.js --name "auth-backend"

# 查看服务状态
pm2 status
pm2 logs auth-backend
```

### 使用Docker

创建 `Dockerfile`：
```dockerfile
# 后端Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --only=production
COPY backend/ .
EXPOSE 3000
CMD ["npm", "start"]
```

构建和运行：
```bash
docker build -t auth-backend .
docker run -p 3000:3000 auth-backend
```

### 使用Nginx反向代理

Nginx配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 监控和维护

### 日志管理
```bash
# PM2日志
pm2 logs auth-backend

# 应用日志
tail -f backend/logs/app.log
```

### 数据库备份
```bash
# SQLite数据库备份
cp backend/database.sqlite backend/database.sqlite.backup.$(date +%Y%m%d)
```

### 健康检查
```bash
# 检查服务状态
curl http://localhost:3000/health

# 检查数据库连接
npm run test -- test/database.test.js
```

## 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 查看端口占用
   netstat -tulpn | grep :3000
   
   # 杀死占用进程
   kill -9 <PID>
   ```

2. **权限问题**
   ```bash
   # 修改文件权限
   chmod +x backend/src/app.js
   
   # 修改目录权限
   chown -R $USER:$USER .
   ```

3. **依赖问题**
   ```bash
   # 清除缓存
   npm cache clean --force
   
   # 重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **数据库问题**
   ```bash
   # 重置数据库
   rm backend/database.sqlite
   # 重启服务，数据库会自动重新创建
   ```

## 性能优化

### 后端优化
- 启用gzip压缩
- 配置缓存策略
- 数据库连接池优化
- 使用集群模式

### 前端优化
- 代码分割和懒加载
- 静态资源CDN
- 浏览器缓存策略
- 图片优化

## 安全建议

1. **环境变量安全**
   - 使用强密码作为JWT_SECRET
   - 不要将敏感信息提交到版本控制

2. **网络安全**
   - 使用HTTPS
   - 配置CORS策略
   - 实施速率限制

3. **数据库安全**
   - 定期备份数据
   - 限制数据库访问权限
   - 使用参数化查询防止SQL注入