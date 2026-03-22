@echo off
echo ========================================
echo   B站用户成分分析器 - 部署检查工具
echo ========================================
echo.

REM 检查 Git 是否已安装
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未检测到 Git，请先安装 Git
    pause
    exit /b 1
)
echo ✅ Git 已安装

echo.
echo 📋 部署前检查清单：
echo.

REM 检查 .env 文件
if exist "backend\.env" (
    echo ⚠️  警告：backend\.env 存在，请确保不包含敏感信息
) else (
    echo ✅ backend\.env 不存在（正确）
)

if exist "frontend\.env" (
    echo ⚠️  警告：frontend\.env 存在，请确保不包含敏感信息
) else (
    echo ✅ frontend\.env 不存在（正确）
)

echo.
echo 🔍 检查 package.json...
if exist "package.json" (
    echo ✅ 根目录 package.json 存在
) else (
    echo ❌ 根目录 package.json 缺失
)

if exist "backend\package.json" (
    echo ✅ backend/package.json 存在
) else (
    echo ❌ backend/package.json 缺失
)

if exist "frontend\package.json" (
    echo ✅ frontend/package.json 存在
) else (
    echo ❌ frontend/package.json 缺失
)

echo.
echo ========================================
echo   下一步操作：
echo ========================================
echo.
echo 1️⃣  初始化 Git 仓库（如果还没有）：
echo    git init
echo    git add .
echo    git commit -m "准备部署"
echo.
echo 2️⃣  推送到 GitHub：
echo    git remote add origin https://github.com/你的用户名/bilibili-analyzer.git
echo    git push -u origin main
echo.
echo 3️⃣  部署后端到 Railway：
echo    - 访问 https://railway.app
echo    - 连接 GitHub 并选择项目
echo    - 配置环境变量
echo.
echo 4️⃣  部署前端到 Vercel：
echo    - 访问 https://vercel.com
echo    - Import 项目
echo    - 设置 API URL 环境变量
echo.
echo 📄 详细指南请查看：DEPLOYMENT.md
echo.
echo ========================================
pause
