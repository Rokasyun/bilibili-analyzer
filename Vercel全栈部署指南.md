# 🚀 Vercel 全栈部署 - 终极指南

## ✅ 已完成配置

- ✅ vercel.json 已配置前后端构建
- ✅ 后端 API 适配 Serverless（vercel-index.ts）
- ✅ package.json 添加 vercel-build 脚本
- ✅ 路由配置：前端静态文件 + 后端 API

---

## 🎯 超简单的部署步骤

### **第 1 步：推送到 GitHub**

当前代码已经推送，Vercel 会自动检测更新。

访问：https://github.com/Rokasyun/bilibili-analyzer

确认最新 commit 包含：
- ✅ vercel.json 配置
- ✅ backend/src/vercel-index.ts
- ✅ package.json 的 vercel-build 脚本

---

### **第 2 步：配置 Vercel**

👉 **访问：** https://vercel.com/dashboard

找到你的项目 `bilibili-analyzer`，或者重新 Import：

https://vercel.com/new/clone?repository-url=https://github.com/Rokasyun/bilibili-analyzer

#### Configure Project

**Framework Preset:** 
- 选择 `Vite`

**Root Directory:** 
- **留空**（不要填 frontend！）⚠️

**Build Command:** 
```bash
npm run vercel-build
```

**Output Directory:** 
```bash
frontend/dist
```

#### Environment Variables（重要！）

添加以下环境变量：

```
BILIBILI_COOKIE=你的B站Cookie（必须配置）
CORS_ORIGIN=*
NODE_ENV=production
```

**Cookie 获取方法：**
1. 浏览器访问 https://www.bilibili.com 并登录
2. 按 F12 打开开发者工具
3. Network 标签 → 刷新页面（F5）
4. 点击左侧任意请求
5. 右侧找到 "Request Headers"
6. 复制完整的 "Cookie" 字段值

---

### **第 3 步：Deploy**

点击 **Deploy**，等待 3-5 分钟

Vercel 会：
1. 安装所有依赖
2. 构建后端 TypeScript
3. 构建前端 Vite
4. 部署静态文件到 CDN
5. 部署 API 为 Serverless Functions

---

## 🎉 完成！

部署成功后，你会得到一个地址：

**主站点：** `https://bilibili-analyzer.vercel.app`

**API 端点：** 
- `https://bilibili-analyzer.vercel.app/api/analyze/546195`
- `https://bilibili-analyzer.vercel.app/health`

---

## 🧪 测试清单

### 1. 访问主页
```
https://bilibili-analyzer.vercel.app
```
✅ 应该能看到前端界面

### 2. 测试 API
```
https://bilibili-analyzer.vercel.app/health
```
✅ 应该返回：
```json
{
  "status": "ok",
  "message": "Bilibili Analyzer API is running on Vercel"
}
```

### 3. 测试用户分析
访问或输入用户 ID：`546195`

✅ 应该能正常查询老番茄的数据

### 4. 检查 HTTPS
- ✅ 地址栏有小锁图标
- ✅ 自动 HTTPS 证书

---

## 📁 项目结构说明

```
bilibili-analyzer/
├── frontend/              # 前端项目
│   ├── src/              # 源代码
│   └── dist/             # 构建输出（Vercel 会生成）
│
├── backend/              # 后端项目
│   ├── src/
│   │   ├── index.ts      # 本地开发用
│   │   └── vercel-index.ts  # Vercel 专用（无端口监听）
│   └── dist/             # 构建输出
│
└── vercel.json           # Vercel 配置
    - 构建 frontend 为静态文件
    - 构建 backend 为 Serverless Functions
    - 路由：/api/* → 后端，/* → 前端
```

---

## ⚠️ 重要注意事项

### 1. Cookie 必须配置

B 站 API 有严格的限流，不配置 Cookie 会导致：
- ❌ 频繁报错「请求被限流」
- ❌ 无法获取用户数据
- ❌ 分析失败

**解决：** 务必在 Vercel 配置 `BILIBILI_COOKIE` 环境变量

### 2. Serverless 限制

Vercel Serverless Functions 有以下限制：

**免费计划：**
- ⏱️ 最大执行时间：10 秒
- 💾 内存：1024 MB
- 📦 包大小：50 MB
- 🌐 带宽：100 GB/月

**影响：**
- 复杂分析可能超时（>10 秒）
- 大量数据可能内存不足

**解决：**
- 优化代码减少执行时间
- 使用缓存（Node-Cache 已集成）
- 考虑升级到 Pro 计划（$20/月）

### 3. 冷启动问题

Serverless 函数在闲置后会进入冷状态，首次访问需要：
- ⏱️ 唤醒时间：1-3 秒
- 之后恢复正常速度

**解决：**
- 使用 https://cron-job.org 定期访问保持活跃
- 或升级到 Pro 计划（无冷启动）

---

## 🔧 故障排查

### Build Failed

**查看日志：** Vercel Dashboard → Deployments → 点击查看构建日志

**常见原因：**
1. Node.js 版本不兼容
   - 解决：Vercel 会自动选择合适版本
   
2. 依赖安装失败
   - 解决：本地测试 `npm run vercel-build`

3. TypeScript 编译错误
   - 解决：检查 `backend/src/vercel-index.ts`

### API 返回 500 错误

**检查：**
1. 环境变量是否配置
2. BILIBILI_COOKIE 是否有效
3. 查看 Function Logs（Vercel Dashboard → Functions）

### 前端空白页

**检查：**
1. Output Directory 是否正确：`frontend/dist`
2. 浏览器控制台是否有错误
3. Network 面板查看 API 请求

### CORS 错误

**解决：**
已在 vercel-index.ts 中配置 `cors({ origin: '*' })`

---

## 📊 部署流程图

```
GitHub Push
    ↓
Vercel 自动检测
    ↓
运行 vercel-build 脚本
    ├─→ npm install (根目录)
    ├─→ cd backend && npm install && npm run build
    └─→ cd frontend && npm install && npm run build
    ↓
部署
    ├─→ frontend/dist → 静态文件 (CDN)
    └─→ backend/src/vercel-index.ts → Serverless Function
    ↓
生成域名
    └─→ https://bilibili-analyzer.vercel.app
```

---

## 🎯 快速总结

### 配置要点
```
✅ Root Directory: 留空
✅ Build Command: npm run vercel-build
✅ Output Directory: frontend/dist
✅ 环境变量：BILIBILI_COOKIE, CORS_ORIGIN, NODE_ENV
```

### 测试要点
```
✅ 主页可访问
✅ /health 返回 OK
✅ 用户分析正常工作
✅ HTTPS 已启用
```

---

## 💡 优化建议

### 1. 添加缓存

后端已集成 Node-Cache，默认缓存 1 小时：
```typescript
// backend/src/services/analyzer.ts
const cache = new NodeCache({ stdTTL: 3600 })
```

### 2. 监控性能

访问 Vercel Dashboard → Analytics 查看：
- Web Vitals（前端性能）
- Function 执行时间
- 错误率

### 3. 自定义域名

Settings → Domains → Add Domain

---

## 🆘 遇到问题？

### 查看文档
- [`部署操作指南.md`](部署操作指南.md) - 完整教程
- [`QUICK_DEPLOY.md`](QUICK_DEPLOY.md) - 快速参考

### 查看日志
- Vercel Dashboard → Deployments → 点击最新部署
- Functions → 查看 API 日志

### 随时问我！

部署过程中遇到任何问题，直接把错误信息发给我！

---

**预计时间：5-8 分钟**  
**费用：¥0（免费计划）**

**准备好了吗？开始吧！** 🚀
