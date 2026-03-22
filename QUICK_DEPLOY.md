# ⚡ 快速部署指南 - 5 分钟上线

## 🎯 最简方案：前后端分离部署

### 第一步：推送到 GitHub（2 分钟）

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "准备部署到线上"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/bilibili-analyzer.git

# 推送
git push -u origin main
```

---

### 第二步：部署后端到 Railway（3 分钟）

1. **访问** https://railway.app
2. **登录**（使用 GitHub 账号）
3. **New Project** → **Deploy from GitHub repo**
4. **选择** `bilibili-analyzer` 仓库
5. **等待**自动构建完成
6. **配置环境变量**（Settings → Variables）：
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   BILIBILI_COOKIE=你的B站Cookie（可选但推荐）
   ```
7. **记录后端地址**，如：`https://xxx-production.up.railway.app`

✅ 后端部署完成！

---

### 第三步：部署前端到 Vercel（3 分钟）

1. **访问** https://vercel.com
2. **登录**（使用 GitHub 账号）
3. **Add New Project** → **Import Git Repository**
4. **选择** `bilibili-analyzer` 仓库
5. **配置 Framework Preset**: `Vite`
6. **配置 Root Directory**: `frontend`
7. **配置环境变量**（Settings → Environment Variables）：
   ```
   VITE_API_URL=https://xxx-production.up.railway.app
   ```
   （填入上一步的 Railway 地址）
8. **点击 Deploy**
9. **等待**构建完成

✅ 前端部署完成！

---

### 第四步：测试验证（1 分钟）

访问 Vercel 分配的域名，如：`https://bilibili-analyzer.vercel.app`

测试功能：
- ✅ 输入用户 ID：`546195`（老番茄）
- ✅ 查看分析结果
- ✅ 检查图表显示

---

## 🎉 完成！

现在你的应用已经上线了！

**总耗时**: ~10 分钟  
**费用**: $0（免费额度内）

---

## 📝 重要提醒

### 1. Cookie 配置（避免限流）

获取 B站 Cookie：
1. 浏览器访问 bilibili.com 并登录
2. 按 F12 打开开发者工具
3. Network 标签 → 刷新页面
4. 复制任意请求的 Cookie 字段
5. 在 Railway Dashboard 中添加环境变量：
   ```
   BILIBILI_COOKIE=复制的 Cookie 值
   ```

### 2. 自定义域名（可选）

- **Vercel**: Settings → Domains
- **Railway**: Settings → Domains

### 3. 更新代码

```bash
# 本地修改后
git add .
git commit -m "更新内容"
git push

# Railway/Vercel 会自动重新部署
```

---

## 🆘 遇到问题？

查看详细文档：[DEPLOYMENT.md](DEPLOYMENT.md)

或运行检查工具：
```bash
deploy-check.bat
```
