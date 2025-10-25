# 前端应用 - 部署和测试指南

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 3. 构建生产版本
```bash
npm run build
```

## 测试

### 运行测试
```bash
npm test
```

## 开发

### 技术栈
- React + TypeScript
- Vite 构建工具
- 现代化UI组件

### 项目结构
```
src/
├── App.tsx          # 主应用组件
├── main.tsx         # 应用入口
├── components/      # 可复用组件
├── styles/          # 样式文件
└── test/           # 测试文件
```

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

## 开发建议

1. 遵循React和TypeScript最佳实践
2. 使用组件化开发模式
3. 保持代码简洁和可维护性