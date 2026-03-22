@echo off
echo ========================================
echo B站用户成分分析器 - 启动脚本
echo ========================================
echo.

echo [1/3] 检查依赖安装...
if not exist "node_modules\" (
    echo 正在安装根目录依赖...
    call npm install
)

if not exist "frontend\node_modules\" (
    echo 正在安装前端依赖...
    cd frontend
    call npm install
    cd ..
)

if not exist "backend\node_modules\" (
    echo 正在安装后端依赖...
    cd backend
    call npm install
    cd ..
)

echo.
echo [2/3] 检查环境变量...
if not exist "backend\.env" (
    echo 创建后端环境变量文件...
    copy backend\.env.example backend\.env
)

if not exist "frontend\.env" (
    echo 创建前端环境变量文件...
    copy frontend\.env.example frontend\.env
)

echo.
echo [3/3] 启动开发服务器...
echo.
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3001
echo.
echo 按 Ctrl+C 停止服务
echo.

call npm run dev
