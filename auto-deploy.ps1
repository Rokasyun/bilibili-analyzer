# 🚀 一键部署脚本 - 自动完成所有步骤

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  B站用户成分分析器 - 自动部署工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git
Write-Host "[1/5] 检查 Git 状态..." -ForegroundColor Yellow
try {
    $gitStatus = git status
    Write-Host "✅ Git 正常" -ForegroundColor Green
} catch {
    Write-Host "❌ Git 未安装，请先安装 Git" -ForegroundColor Red
    pause
    exit
}

# 检查 GitHub 连接
Write-Host ""
Write-Host "[2/5] 检查 GitHub 仓库..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin
Write-Host "📦 仓库地址：$remoteUrl" -ForegroundColor Cyan

if ($remoteUrl -notlike "*Rokasyun/bilibili-analyzer*") {
    Write-Host "⚠️  警告：远程仓库地址可能不正确" -ForegroundColor Yellow
} else {
    Write-Host "✅ GitHub 仓库已连接" -ForegroundColor Green
}

# 推送最新代码
Write-Host ""
Write-Host "[3/5] 推送代码到 GitHub..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ 代码已成功推送到 GitHub" -ForegroundColor Green
} catch {
    Write-Host "❌ 推送失败：$_" -ForegroundColor Red
    pause
    exit
}

# 显示部署指南
Write-Host ""
Write-Host "[4/5] 准备部署配置..." -ForegroundColor Yellow

# 创建 Railway 快速部署链接
$railwayUrl = "https://railway.app/new?template=https://github.com/Rokasyun/bilibili-analyzer"
Write-Host "🚂 Railway 部署：" -ForegroundColor Cyan
Write-Host "   访问：$railwayUrl" -ForegroundColor White
Write-Host "   或使用手动部署流程（见下方）" -ForegroundColor White

# 创建 Vercel 快速部署链接
$vercelUrl = "https://vercel.com/new/clone?repository-url=https://github.com/Rokasyun/bilibili-analyzer&root-directory=frontend"
Write-Host ""
Write-Host "▲ Vercel 部署：" -ForegroundColor Magenta
Write-Host "   访问：$vercelUrl" -ForegroundColor White
Write-Host "   或使用手动部署流程（见下方）" -ForegroundColor White

# 环境变量配置说明
Write-Host ""
Write-Host "[5/5] 环境变量配置说明" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "  Railway 环境变量（后端）" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "   CORS_ORIGIN=*" -ForegroundColor Gray
Write-Host "   BILIBILI_COOKIE=你的B站Cookie（重要！）" -ForegroundColor Gray
Write-Host ""
Write-Host "   Cookie 获取方法：" -ForegroundColor Yellow
Write-Host "   1. 浏览器访问 bilibili.com 并登录" -ForegroundColor Gray
Write-Host "   2. F12 开发者工具 → Network 标签" -ForegroundColor Gray
Write-Host "   3. 刷新页面 → 复制任意请求的 Cookie" -ForegroundColor Gray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "  Vercel 环境变量（前端）" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "   VITE_API_URL=https://你的后端.railway.app" -ForegroundColor Gray
Write-Host "   （等 Railway 部署完成后填入）" -ForegroundColor Yellow
Write-Host ""

# 显示下一步操作
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  下一步操作" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "【方案 A】使用快速部署链接（推荐）：" -ForegroundColor Yellow
Write-Host "  1. 按 Ctrl+点击上面的 Railway 链接" -ForegroundColor White
Write-Host "  2. 用 GitHub 登录并授权" -ForegroundColor White
Write-Host "  3. Railway 会自动构建（2-5 分钟）" -ForegroundColor White
Write-Host "  4. 在 Railway 配置环境变量" -ForegroundColor White
Write-Host "  5. 按 Ctrl+点击 Vercel 链接" -ForegroundColor White
Write-Host "  6. Import 项目，设置 API URL" -ForegroundColor White
Write-Host ""
Write-Host "【方案 B】手动部署（如果快速链接无效）：" -ForegroundColor Yellow
Write-Host "  Railway: https://railway.app" -ForegroundColor White
Write-Host "  Vercel:  https://vercel.com" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  需要帮助？" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "查看完整文档：" -ForegroundColor Yellow
Write-Host "  - 部署操作指南.md（超详细教程）" -ForegroundColor White
Write-Host "  - QUICK_DEPLOY.md（快速上手）" -ForegroundColor White
Write-Host ""
Write-Host "遇到问题随时问我！" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

pause
