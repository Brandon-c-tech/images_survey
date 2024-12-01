# images_survey

一个简单的图片选择问卷系统，前端使用 React，后端使用 FastAPI。

## 功能特点

- 支持多题图片选择
- 不定项选择
- 基于用户名的答案追踪
- 响应式设计，支持移动端
- RESTful API 接口

## 项目结构

项目分为前端（frontend）和后端（backend）两个主要部分。

## 运行项目

### 环境准备

1. 安装 Node.js 和 npm：
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# 验证安装
node --version
npm --version
```

### 后端部署

1. 进入后端目录：
```bash
cd backend
```

2. 创建虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 运行后端服务：
```bash
python main.py
```

服务将在 http://localhost:8000 运行

### 前端部署

1. 确保已安装 Node.js 和 npm

2. 进入前端目录：
```bash
cd frontend
```

3. 安装依赖：
```bash
npm install
```

4. 运行开发服务器：
```bash
npm start
```

前端将在 http://localhost:3000 运行

## 项目配置

### 后端配置

配置文件位于 `backend/app/config.py`，可以修改：
- 数据库连接
- 静态文件目录
- CORS 设置

### 前端配置

配置文件位于 `frontend/src/services/api.js`，可以修改：
- API 基础URL
- 其他全局配置

## 测试

### 后端测试
```bash
cd backend
pytest
```

### 前端测试
```bash
cd frontend
npm test
```

## 部署说明

1. 确保已经配置好数据库
2. 上传图片到 backend/static/images 目录
3. 在生产环境中更新 CORS 设置和 API URL