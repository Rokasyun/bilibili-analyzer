#!/bin/bash

echo "========================================"
echo "B站用户成分分析器 - 启动脚本"
echo "========================================"
echo ""

echo "[1/3] 检查依赖安装..."
if [ ! -d "node_modules" ]; then
    echo "正在安装根目录依赖..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "正在安装前端依赖..."
    cd frontend
    npm install
    cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "正在安装后端依赖..."
    cd backend
    npm install
    cd ..
fi

echo ""
echo "[2/3] 检查环境变量..."
if [ ! -f "backend/.env" ]; then
    echo "创建后端环境变量文件..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    echo "创建前端环境变量文件..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "[3/3] 启动开发服务器..."
echo ""
echo "前端地址: http://localhost:5173"
echo "后端地址: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

npm run dev
