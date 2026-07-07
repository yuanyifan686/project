# AI 智能体课程咨询网站

> AI 教育课程展示 + 智能客服咨询网站（V2 增强版）

## 项目简介

面向 AI 智能体课程的咨询网站，提供课程展示、师资介绍、智能客服、后台管理与咨询转化能力。

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | Vue3 + Element Plus + Vite 构建 |
| 后端 | Python 3.11+ / FastAPI + JWT |
| 数据库 | SQLite（SQLAlchemy 2.0 + WAL） |
| AI 客服 | Coze API 服务端代理（密钥不暴露） |
| 部署 | Docker / docker-compose |

## 快速启动

### 方式一：一体化部署（推荐）

```bash
cd C:\Users\a\Desktop\project
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python backend\seed_data.py
start_backend.bat
```

访问：
- 前台：http://127.0.0.1:8000
- 后台：http://127.0.0.1:8000/admin.html
- API 文档：http://127.0.0.1:8000/docs

默认管理员：`admin` / `admin123`（可在 `backend/.env` 修改）

### 方式二：Vite 前端开发

```bash
# 终端 1：后端
python backend\app.py

# 终端 2：前端
cd frontend
npm install
npm run dev
```

Vite 开发服务器：http://127.0.0.1:5173（API 代理到 8000）

### 方式三：Docker 生产部署

```bash
docker compose up --build -d
```

构建时自动执行 `npm run build`，后端托管 `frontend/dist`。

## V2 功能

### 后台管理
- 课程 / 师资 CRUD
- **Banner 管理**（增删改）
- **评价管理**（增删改）
- **咨询状态流转**：待处理 → 已联系 → 已关闭

### 性能优化
- 课程列表**分页**（`GET /api/courses?page=1&page_size=12`）
- 图片**懒加载**（课程卡片、Banner、师资、评价）

### 安全增强
- 管理员 **JWT** 认证（替代固定 Token）
- Coze API Key **仅服务端持有**，前端通过 `/api/chat` 代理对话

## 环境变量（backend/.env）

```env
COZE_API_KEY=pat_xxx
COZE_BOT_ID=7644412189956685870
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-key
JWT_EXPIRE_HOURS=24
HOST=127.0.0.1
PORT=8000
```

## 主要 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/courses?page=1` | 课程分页列表 |
| GET | `/api/chat/config` | AI 模式（不含密钥） |
| POST | `/api/chat` | AI 对话（服务端代理） |
| POST | `/api/admin/login` | 登录获取 JWT |
| GET/POST/PUT/DELETE | `/api/admin/banners` | Banner 管理 |
| GET/POST/PUT/DELETE | `/api/admin/reviews` | 评价管理 |
| PATCH | `/api/admin/consultations/{id}/status` | 咨询状态更新 |

## 目录结构

```
.
├── frontend/           # 前端（CDN 开发 + Vite 生产构建）
│   ├── dist/           # npm run build 产出
│   ├── entries/        # Vite 入口
│   └── js/             # 页面与组件
├── backend/            # FastAPI 服务
├── database/           # SQLite 数据
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## 文档

- [PRD](docs/PRD.md)
- [SOP](docs/SOP.md)