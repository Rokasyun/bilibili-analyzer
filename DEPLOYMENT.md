# 🚀 B站用户成分分析器 - 部署指南

## 方案一：前后端分离部署（推荐）

### 后端部署到 Railway

#### 步骤：

1. **准备 GitHub 仓库**
   ```bash
   # 确保代码已推送到 GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/bilibili-analyzer.git
   git push -u origin main
   ```

2. **部署到 Railway**
   - 访问 https://railway.app
   - 登录并连接 GitHub
   - 选择 `bilibili-analyzer` 仓库
   - Railway 会自动识别 `railway.json` 配置文件
   
3. **配置环境变量**（Railway Dashboard → Variables）
   ```
   PORT=3001
   CORS_ORIGIN=https://your-frontend.vercel.app
   BILIBILI_COOKIE=你的B站Cookie（可选但推荐）
   ```

4. **获取后端地址**
   - Railway 会分配一个地址，如：`https://bilibili-analyzer-production.up.railway.app`
   - 记录下来，前端需要用到

---

### 前端部署到 Vercel

#### 步骤：

1. **部署到 Vercel**
   - 访问 https://vercel.com
   - 登录并连接 GitHub
   - Import `bilibili-analyzer` 项目
   - Framework Preset 选择 `Vite`

2. **配置环境变量**（Vercel Dashboard → Settings → Environment Variables）
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

3. **Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **部署完成**
   - Vercel 会分配地址：`https://bilibili-analyzer.vercel.app`

---

## 方案二：统一部署到 Vercel（简化版）

### 优点：
- 只需一个平台
- 管理更简单
- 自动 HTTPS

### 缺点：
- Serverless 有运行时长限制
- Cookie 需要妥善保护

### 部署步骤：

1. **修改 Vercel 配置**
   - 使用已创建的 `vercel.json`
   - 根目录部署

2. **配置环境变量**
   ```
   BILIBILI_COOKIE=你的B站Cookie
   CORS_ORIGIN=https://your-app.vercel.app
   ```

3. **部署**
   ```bash
   vercel deploy --prod
   ```

---

## 方案三：Docker 部署（高级）

### 创建 Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### 部署到支持 Docker 的平台

- **Railway**: 自动识别 Dockerfile
- **Render**: 选择 Docker 部署
- **Fly.io**: `flyctl deploy`

---

## 🔐 安全建议

1. **Cookie 保护**
   - 不要将 `.env` 文件提交到 Git
   - 使用平台的环境变量功能
   - 定期更新 Cookie

2. **CORS 配置**
   - 生产环境只允许特定域名
   - 已在 `backend/src/index.ts` 中配置

3. **API 限流保护**
   - 建议配置 BILIBILI_COOKIE
   - 考虑添加速率限制中间件

---

## 📊 测试验证

部署后测试以下端点：

1. **健康检查**
   ```
   GET https://your-backend-domain.com/health
   ```

2. **用户分析**
   ```
   GET https://your-backend-domain.com/api/analyze/546195
   ```

3. **前端访问**
   ```
   https://your-frontend-domain.com
   ```

---

## 🔧 故障排查

### 常见问题：

1. **CORS 错误**
   - 检查 `CORS_ORIGIN` 环境变量
   - 确保前后端域名匹配

2. **API 限流**
   - 配置 `BILIBILI_COOKIE`
   - 减少请求频率

3. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确认依赖安装完整

---

## 📈 性能优化建议

1. **启用 CDN**
   - Vercel/Netlify 自带 CDN
   - 静态资源自动缓存

2. **数据库缓存**
   - 考虑使用 Redis 缓存分析结果
   - 减少 B 站 API 调用

3. **懒加载**
   - 前端组件按需加载
   - 减少首屏加载时间

---

## ✅ 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] 后端环境变量已配置
- [ ] 前端 API URL 已更新
- [ ] Cookie 已配置（避免限流）
- [ ] CORS 域名已正确设置
- [ ] 健康检查通过
- [ ] 前端能正常访问后端 API
- [ ] 移动端响应式正常
- [ ] HTTPS 已启用

---

**祝部署顺利！🎉**
