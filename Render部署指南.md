# 🚀 Render 部署 - 完全免费 + 简单！

## ✅ 为什么选择 Render？

- 💰 **完全免费** - 不需要信用卡
- 🆓 **免费额度充足** - 750 小时/月（相当于 24/7 运行）
- ⚡ **自动 HTTPS**
- 🔄 **自动部署**
- 🎯 **原生支持 Node.js**

---

## 🎯 3 步部署

### **第 1 步：访问 Render**

👉 **点击这里：** https://render.com

用 GitHub 登录

---

### **第 2 步：创建 Web Service**

1. 点击 **"New +"** → **"Web Service"**
2. Connect Repository: 选择 `bilibili-analyzer`
3. Configure:

**Name:** `bilibili-analyzer`

**Region:** 选最近的（比如 Singapore）

**Branch:** `main`

**Root Directory:** `backend` ← 重要！

**Runtime:** `Node`

**Build Command:** 
```bash
npm install && npm run build
```

**Start Command:** 
```bash
npm start
```

**Instance Type:** `Free`

---

### **第 3 步：配置环境变量**

点击 **"Environment"** → **"Add Environment Variable"**

添加：

```
BILIBILI_COOKIE=你的B站Cookie（重要！）
CORS_ORIGIN=*
PORT=3001
```

**Cookie 获取方法：**
1. bilibili.com 登录后按 F12
2. Network → 刷新页面
3. 复制任意请求的 Cookie

然后点击 **"Create Web Service"**

等待 3-5 分钟构建完成！

---

## 🎉 完成！

Render 会给你一个地址：
```
https://bilibili-analyzer.onrender.com
```

**测试 API：**
```
https://bilibili-analyzer.onrender.com/health
https://bilibili-analyzer.onrender.com/api/analyze/546195
```

---

## 🌐 前端部署到 Vercel

现在后端好了，部署前端：

### 访问 Vercel

👉 https://vercel.com/new/clone?repository-url=https://github.com/Rokasyun/bilibili-analyzer&root-directory=frontend

**配置：**
- Root Directory: `frontend`
- Framework: `Vite`

**环境变量：**
```
VITE_API_URL=https://bilibili-analyzer.onrender.com
```

Deploy！

---

## 🎊 最终效果

**前端：** `https://bilibili-analyzer.vercel.app`  
**后端：** `https://bilibili-analyzer.onrender.com`

访问前端，输入 `546195` 测试！

---

## ⚠️ 注意事项

### Render 免费计划特点：

- ✅ **750 小时/月**（足够一直运行）
- ✅ **512MB RAM**
- ✅ 自动休眠（15 分钟无访问）
- ✅ 访问时自动唤醒（约 30 秒）

### 避免休眠：

使用 https://cron-job.org 每 14 分钟访问一次 `/health` 端点

---

## 💰 费用对比

| 平台 | 免费计划 | 需要信用卡 | 适合本项目 |
|------|---------|-----------|----------|
| Railway | ❌ 需绑定卡 | ✅ 是 | ❌ |
| Render | ✅ 750 小时 | ❌ 否 | ✅ |
| Vercel | ✅ 无限 | ❌ 否 | ✅ |

**推荐组合：Render（后端）+ Vercel（前端）**

---

## 🔧 故障排查

### Build failed

检查日志，确保：
- Root Directory 是 `backend`
- Build Command 正确
- 本地测试：`cd backend && npm run build`

### Service crashed

查看 Logs 标签，常见原因：
- 端口配置错误
- 缺少环境变量
- 依赖问题

### API 限流

必须配置 `BILIBILI_COOKIE`

---

## 📊 完整步骤总结

```
【后端 - Render】
1. https://render.com
2. New + → Web Service
3. Root Directory: backend
4. Build: npm install && npm run build
5. Start: npm start
6. 环境变量：BILIBILI_COOKIE, CORS_ORIGIN, PORT
7. Create Web Service

【前端 - Vercel】
1. https://vercel.com/new
2. Root Directory: frontend
3. 环境变量：VITE_API_URL=https://你的后端.onrender.com
4. Deploy
```

**预计时间：10 分钟**  
**费用：¥0**

---

需要帮助随时问我！💬
