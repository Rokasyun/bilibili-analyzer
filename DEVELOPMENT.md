# B站用户成分分析器

一个用于分析B站用户兴趣成分的Web应用程序。通过分析用户关注列表、投稿视频等数据，生成用户的兴趣成分报告。
[backend](backend)
## 📁 项目结构

```
bilibili-analyzer/
├── frontend/                # 前端项目 (React + Vite + TypeScript)
│   ├── src/
│   │   ├── api/            # API 接口
│   │   ├── pages/          # 页面组件
│   │   ├── App.tsx         # 根组件
│   │   └── main.tsx        # 入口文件
│   ├── index.html
│   └── package.json
│
├── backend/                 # 后端项目 (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/         # 路由
│   │   ├── services/       # 服务层
│   │   └── index.ts        # 入口文件
│   └── package.json
│
└── package.json            # 根目录配置
```

## 🚀 快速开始

### 1. 安装依赖

在项目根目录运行：

```bash
npm install
npm run install:all
```

或者分别安装：

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 2. 配置环境变量

#### 后端配置
复制 `backend/.env.example` 为 `backend/.env`（已自动创建）：
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

#### 前端配置
复制 `frontend/.env.example` 为 `frontend/.env`（已自动创建）：
```env
VITE_API_URL=http://localhost:3001
```

### 3. 启动开发服务器

#### 方法一：同时启动前后端（推荐）
```bash
npm run dev
```

#### 方法二：分别启动
```bash
# 终端1 - 启动后端
cd backend
npm run dev

# 终端2 - 启动前端
cd frontend
npm run dev
```

### 4. 访问应用

- 前端: http://localhost:5173
- 后端API: http://localhost:3001
- 健康检查: http://localhost:3001/health

## 🔧 开发说明

### API 端点

- `GET /api/analyze/:uid` - 分析用户成分
- `GET /api/user/:uid` - 获取用户基本信息
- `GET /health` - 健康检查

### 技术栈

**前端：**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts（图表）
- Axios

**后端：**
- Node.js
- Express
- TypeScript
- Axios
- Node-Cache（缓存）

## 📦 构建部署

### 构建生产版本

```bash
# 构建后端
cd backend
npm run build

# 构建前端
cd frontend
npm run build
```

### 部署建议

**后端部署（Railway/Render）：**
1. 连接GitHub仓库
2. 设置根目录为 `backend`
3. 构建命令：`npm install && npm run build`
4. 启动命令：`npm start`
5. 配置环境变量（PORT, CORS_ORIGIN）

**前端部署（Vercel/Netlify）：**
1. 连接GitHub仓库
2. 设置根目录为 `frontend`
3. 构建命令：`npm run build`
4. 输出目录：`dist`
5. 配置环境变量（VITE_API_URL）

## ⚠️ 注意事项

1. **API限流**：B站API有访问频率限制，后端已实现1小时缓存
2. **隐私保护**：本应用不存储任何用户数据
3. **合规使用**：请遵守B站用户协议和robots.txt
4. **数据准确性**：分析结果基于公开数据，仅供参考

## 🔧 解决API限流问题

如果遇到「请求被限流，请稍后再试或配置BILIBILI_COOKIE环境变量」错误，请按以下步骤操作：

### 获取B站Cookie

1. 打开浏览器，访问 https://www.bilibili.com 并登录
2. 按 `F12` 打开开发者工具
3. 切换到 `Network（网络）` 标签
4. 刷新页面（`F5`）
5. 点击列表中的任意请求
6. 在右侧面板找到 `Request Headers`
7. 找到 `Cookie` 字段，复制完整的Cookie值

### 配置Cookie

编辑 `backend/.env` 文件：

```env
# 取消注释并填入你的Cookie
BILIBILI_COOKIE=你复制的完整Cookie值
```

保存后，后端服务器会自动重启并应用新配置。

### 临时解决方案

如果暂时不想配置Cookie，可以使用演示账号：
- `demo` - 完整演示数据
- `1` - B站创始人
- `2` - B站早期用户

## 🔍 功能特性

- ✅ 用户基本信息展示
- ✅ 关注列表分析
- ✅ 投稿视频分区统计
- ✅ 用户成分可视化（饼图、柱状图）
- ✅ 智能标签生成
- ✅ 响应式设计
- ✅ 错误处理和加载状态
- ✅ 数据缓存机制

## 🎯 下一步开发建议

- [ ] 添加用户历史记录
- [ ] 支持多用户对比
- [ ] 生成分享图片
- [ ] 添加更多数据维度（观看历史等）
- [ ] 优化移动端体验
- [ ] 添加深色模式

## 📝 License

MIT
