# 🚀 Vercel 一键部署 - 完全免费！

## ✅ 优势

- 💰 **完全免费** - 不需要信用卡
- ⚡ **自动 HTTPS** - 无需配置
- 🌍 **全球 CDN** - 访问速度快
- 🔄 **自动部署** - Git push 后自动更新
- 📦 **前后端一起** - 一个平台搞定

---

## 🎯 超简单的 3 步部署

### **第 1 步：打开 Vercel**

👉 **点击这里：** https://vercel.com/new/clone?repository-url=https://github.com/Rokasyun/bilibili-analyzer

用 GitHub 登录

---

### **第 2 步：配置项目**

#### Import Git Repository
- 选择 `bilibili-analyzer`

#### Configure Project（重要！）

**Framework Preset:** 
- 选择 `Vite`

**Root Directory:** 
- 保持默认（留空）❗️不要填 frontend

**Build Command:** 
```bash
npm install && npm run build:backend
```

**Output Directory:** 
```bash
dist
```

#### Environment Variables

添加以下环境变量：

```
BILIBILI_COOKIE=你的B站Cookie（重要！）
CORS_ORIGIN=*
NODE_ENV=production
```

**Cookie 获取方法：**
1. bilibili.com 登录后按 F12
2. Network → 刷新页面
3. 复制任意请求的 Cookie 字段

---

### **第 3 步：Deploy**

点击 **Deploy**，等待 2-3 分钟

✅ **完成！**

---

## 🎉 测试上线

Vercel 会给你两个地址：

**前端地址：** `https://bilibili-analyzer.vercel.app`
**后端 API：** `https://bilibili-analyzer.vercel.app/api/analyze/546195`

访问前端地址，输入用户 ID `546195` 测试！

---

## ⚠️ 重要说明

### 为什么修改了 vercel.json？

之前的配置是前后端分离，现在改为**全栈部署**：
- 前端静态文件由 Vercel 托管
- 后端 API 作为 Serverless Function 运行
- 都在同一个域名下，没有 CORS 问题

### 目录结构说明

```
bilibili-analyzer/
├── frontend/          # 前端代码
│   └── dist/         # 构建输出
├── backend/          # 后端代码
│   └── src/         # Serverless 函数
└── vercel.json      # Vercel 配置
```

---

## 🔧 如果部署失败

### 错误：Build failed

检查日志，常见问题：
- Node.js 版本问题 → Vercel 会自动使用合适的版本
- 依赖问题 → 本地测试 `npm run build:backend`

### 错误：API 无法访问

确认路由配置：
- `/api/*` 路由到后端
- `/health` 健康检查

### 错误：B 站 API 限流

必须配置 `BILIBILI_COOKIE` 环境变量

---

## 💡 优化建议

### 1. 前端构建

如果需要同时构建前端，修改：

**Build Command:**
```bash
npm install && npm run build
```

这会同时构建前后端。

### 2. 分离部署（可选）

如果以后想分开：
- 前端继续用 Vercel（Root Directory: frontend）
- 后端用 Render（https://render.com，也免费）

---

## 📊 Vercel 免费额度

- ✅ **无限带宽**
- ✅ **无限请求**
- ✅ **100GB 流量/月**（个人项目完全够用）
- ✅ **自动 SSL 证书**

**不需要绑定信用卡！**

---

## 🎯 快速总结

```
1. 访问：https://vercel.com/new/clone?repository-url=https://github.com/Rokasyun/bilibili-analyzer
2. Root Directory: 留空
3. Build Command: npm install && npm run build:backend
4. 环境变量：BILIBILI_COOKIE, CORS_ORIGIN
5. Deploy!
```

**预计时间：5 分钟**  
**费用：¥0**

---

需要帮助随时问我！💬
