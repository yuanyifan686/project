# AI 智能体课程咨询网站 - MVP 开发实施计划

## 一、计划摘要

基于 `PRD.md` 和 `SOP.md` 的要求，开发一个 AI 智能体课程咨询网站 MVP。技术选型：
- **前端**：Vue3 + Element Plus（通过 CDN 引入，无构建工具）
- **后端**：Python 3.11+ / FastAPI + SQLAlchemy + SQLite
- **AI 客服**：复用 `s.html` 中的 Coze WebSDK 配置（bot_id: `7644412189956685870`）

完成 PRD 中 MVP 阶段的全部 7 项功能：首页、课程列表、课程详情、师资介绍、关于我们、免费咨询、AI 客服入口。

---

## 二、当前状态分析

### 已有资源
- ✅ `AI智能体课程咨询网站 产品需求文档（PRD）.md` - 完整产品需求
- ✅ `AI智能体课程咨询网站_SOP开发规范.md` - 技术规范与开发流程
- ✅ `s.html` - 单页 AI 智能体科普页面，已集成 Coze WebSDK（含有效 bot_id 和 token）

### 现状
- 当前目录无 `frontend/`、`backend/`、`database/`、`docs/` 等结构化目录
- 仅有零散的设计稿和文档，未开始实际编码
- 现有 `s.html` 内容偏科普而非课程咨询，**不能直接复用为业务页面**

### 缺口
- 缺少完整的前端页面（5 个核心页面 + AI 聊天组件）
- 缺少 Python 后端服务（FastAPI + SQLite）
- 缺少数据库初始化脚本和种子数据
- 缺少启动脚本和文档

---

## 三、项目目录结构

按 SOP 规范搭建项目结构：

```
c:\Users\a\Desktop\project\
├── frontend/                       # 前端
│   ├── index.html                  # 入口 HTML（CDN 引入 Vue3、Element Plus、Axios）
│   ├── css/
│   │   └── main.css                # 全局样式（Scoped 风格的主样式表）
│   └── js/
│       ├── app.js                  # Vue3 应用入口、路由配置
│       ├── api.js                  # Axios 封装，统一请求/响应处理
│       ├── mock.js                 # 当后端不可用时的前端兜底数据
│       └── components/             # 公共组件（JS 函数式组件）
│           ├── NavBar.js           # 顶部导航
│           ├── Footer.js           # 页脚
│           ├── CourseCard.js       # 课程卡片
│           ├── TeacherCard.js      # 师资卡片
│           ├── AiChat.js           # AI 客服弹窗组件
│           └── BannerCarousel.js   # Banner 轮播
├── backend/                        # 后端
│   ├── app.py                      # FastAPI 入口、路由注册
│   ├── database.py                 # SQLite 引擎与 Session
│   ├── models.py                   # SQLAlchemy ORM 模型
│   ├── schemas.py                  # Pydantic 数据模型
│   ├── seed_data.py                # 初始化种子数据
│   ├── services/                   # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── course_service.py       # 课程 CRUD
│   │   ├── teacher_service.py      # 师资 CRUD
│   │   ├── banner_service.py       # Banner 数据
│   │   ├── review_service.py       # 用户评价
│   │   └── consultation_service.py # 咨询表单
│   └── .env                        # 环境变量（COZE_API_KEY 等）
├── database/
│   └── ai_course.db                # SQLite 数据库（运行时生成）
├── docs/
│   ├── PRD.md                      # 复制原 PRD
│   └── SOP.md                      # 复制原 SOP
├── start_backend.bat               # Windows 启动后端脚本
├── start_frontend.bat              # Windows 启动前端静态服务脚本
├── requirements.txt                # Python 依赖
├── .gitignore
└── README.md                       # 项目说明
```

---

## 四、数据库设计（SQLite）

按 PRD 第 7 节创建 5 张表：

### 1. `courses`（课程表）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 课程编号 |
| title | TEXT | 课程名称 |
| cover | TEXT | 课程封面 URL |
| teacher | TEXT | 讲师 |
| duration | TEXT | 课程时长 |
| price | REAL | 价格（元） |
| level | TEXT | 难度（初级/中级/高级） |
| description | TEXT | 课程简介 |
| content | TEXT | 课程详情/目录（JSON 字符串） |
| category | TEXT | 分类（大模型应用/Agent 开发/工作流/企业落地） |
| student_count | INTEGER | 学习人数 |
| create_time | DATETIME | 创建时间 |

### 2. `teachers`（师资表）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | 姓名 |
| avatar | TEXT | 头像 URL |
| position | TEXT | 职位 |
| experience | TEXT | 经验 |
| specialty | TEXT | 擅长方向 |
| intro | TEXT | 个人介绍 |

### 3. `banners`（轮播图表）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | |
| image | TEXT | 背景图 |
| title | TEXT | 标题 |
| subtitle | TEXT | 副标题 |
| button_text | TEXT | 按钮文字 |
| url | TEXT | 跳转地址 |

### 4. `consultations`（咨询记录表）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | 姓名 |
| phone | TEXT | 手机号 |
| wechat | TEXT | 微信 |
| course | TEXT | 咨询课程 |
| message | TEXT | 留言内容 |
| create_time | DATETIME | 创建时间 |

### 5. `reviews`（用户评价表）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | 用户名 |
| avatar | TEXT | 头像 |
| content | TEXT | 评价内容 |
| course | TEXT | 关联课程 |
| rating | INTEGER | 评分（1-5） |
| create_time | DATETIME | |

---

## 五、前端页面设计

### 1. `index.html`（入口）
- 通过 CDN 引入：
  - `vue@3` 全局构建版本
  - `Element Plus` 及其样式
  - `Axios`
  - Coze WebSDK（保留 s.html 的集成代码）
- 使用 ES Module 方式组织 JS 代码
- 整体布局：顶部导航 + 路由出口 + 页脚 + AI 聊天悬浮按钮

### 2. 五个核心页面（JS 函数组件）

#### ① Home（首页）
- BannerCarousel 轮播（从后端获取 banners 表数据）
- 热门课程推荐（4-6 张 CourseCard）
- AI 课程优势（4 个特色卡片：大模型应用开发、Agent 智能体开发、自动化工作流、企业 AI 落地）
- 师资介绍（3-4 张 TeacherCard）
- 用户评价（轮播展示）
- 关于我们摘要 + 跳转链接

#### ② CourseList（课程列表）
- 顶部搜索框
- 分类/难度筛选（Element Plus el-cascader / el-radio-group）
- 课程网格（CourseCard 复用）
- 点击跳转 CourseDetail

#### ③ CourseDetail（课程详情）
- 顶部：封面 + 课程名 + 价格 + 时长 + 讲师
- 课程介绍：学习目标、技术体系、实战项目
- 课程目录（解析 content JSON 渲染章节列表）
- 右侧浮动"立即咨询"按钮（点击打开 AiChat）

#### ④ Consult（免费咨询）
- 表单：姓名、手机号、微信、咨询课程（下拉）、留言内容
- 提交校验（手机号格式）
- 右侧展示 AI 客服入口卡片
- 提交后清空表单 + 成功提示

#### ⑤ About（关于我们）
- 公司介绍
- AI 教育理念（4-6 条）
- 联系方式（电话、邮箱、地址）
- 服务优势

### 3. AiChat 组件
- 复用 `s.html` 中的 Coze WebSDK 配置
- 浮动聊天按钮（右下角）
- 点击展开聊天窗口
- 同时保留 `/api/chat` 接口兜底（前端 mock 回复）

---

## 六、后端 API 设计

按 SOP 规范统一返回格式 `{ "code": 200, "data": {} }` / `{ "code": 500, "message": "error" }`。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/banners` | 获取轮播图列表 |
| GET | `/api/courses` | 获取课程列表（支持 `?category=&level=&keyword=` 筛选） |
| GET | `/api/courses/{id}` | 获取课程详情 |
| GET | `/api/teachers` | 获取师资列表 |
| GET | `/api/teachers/{id}` | 获取师资详情 |
| GET | `/api/reviews` | 获取用户评价列表 |
| POST | `/api/consultations` | 提交免费咨询（写入 SQLite） |
| POST | `/api/chat` | AI 聊天（先 mock，预留 Coze 接口） |
| GET | `/` | 健康检查 |
| GET | `/docs` | FastAPI Swagger 文档（自动生成） |

### CORS 配置
- 允许 `http://localhost:8080`、`http://127.0.0.1:8080`
- 允许所有方法与常用头

---

## 七、种子数据计划

`seed_data.py` 初始化以下内容：

### 课程（6 门）
1. AI Agent 智能体开发实战 - 张老师 - 30h - 2999元 - 高级
2. 大模型应用开发入门 - 李老师 - 24h - 1999元 - 初级
3. Prompt 工程精通 - 王老师 - 18h - 1499元 - 中级
4. 自动化工作流实战 - 赵老师 - 20h - 1799元 - 中级
5. 企业 AI 落地训练营 - 陈老师 - 40h - 4999元 - 高级
6. RAG 知识库构建 - 孙老师 - 22h - 2299元 - 中级

### 师资（4 位）
- 张老师 - 资深 AI 架构师 - 10年经验
- 李老师 - 大模型应用专家 - 8年经验
- 王老师 - Prompt 工程专家 - 5年经验
- 赵老师 - 自动化领域专家 - 7年经验

### Banner（3 张）
- "开启 AI Agent 开发之旅" / "从零掌握智能体应用开发" / "立即学习"
- "大模型应用开发" / "系统学习 LLM 应用开发" / "了解课程"
- "企业 AI 落地" / "助力企业智能化转型" / "免费咨询"

### 用户评价（4-5 条）
不同课程的真实感评价。

---

## 八、UI 设计规范

按 PRD 第 6 节执行：

| 元素 | 颜色值 |
|---|---|
| 主色（浅蓝） | `#2b6cb0` / `#3182ce` |
| 辅助色 | `#ffffff` |
| 背景色 | `#f5f7fa` |
| 文字主色 | `#2d3748` |
| 文字次色 | `#718096` |
| 强调色 | `#4299e1` |

**设计原则**：
- 简约科技风：大量留白、卡片化布局、圆角 8-12px
- 响应式：移动端单列、平板 2 列、桌面 3-4 列
- 字体：`-apple-system, "Microsoft YaHei", sans-serif`
- 动画：hover 上浮 4-6px、过渡 0.3s ease
- 复用 Element Plus 组件：el-button、el-card、el-form、el-input、el-table

---

## 九、关键文件实施步骤

### 步骤 1：项目骨架
1. 创建目录结构（frontend、backend、database、docs）
2. 复制 PRD.md、SOP.md 到 docs/
3. 编写 `.gitignore`、根目录 `README.md`

### 步骤 2：后端开发
1. 编写 `requirements.txt`：
   ```
   fastapi>=0.110.0
   uvicorn[standard]>=0.27.0
   sqlalchemy>=2.0.0
   pydantic>=2.5.0
   python-dotenv>=1.0.0
   ```
2. 实现 `database.py`、`models.py`、`schemas.py`
3. 实现各 service 文件
4. 实现 `app.py`（路由注册、CORS、启动事件）
5. 编写 `seed_data.py` 并执行，生成 `ai_course.db`
6. 创建 `start_backend.bat`（Windows 启动脚本）

### 步骤 3：前端开发（按 SOP Step2 顺序）
1. **index.html**：CDN 引入、布局骨架
2. **NavBar.js + Footer.js**：公共组件
3. **Home 页面**：BannerCarousel + 热门课程 + 优势 + 师资 + 评价
4. **CourseList 页面**：筛选 + 网格
5. **CourseDetail 页面**：详情 + 目录
6. **Consult 页面**：表单 + AI 入口
7. **About 页面**：介绍
8. **CourseCard / TeacherCard**：复用组件
9. **AiChat.js**：集成 Coze WebSDK

### 步骤 4：联调与测试
1. 启动后端 `python backend/app.py`
2. 启动前端静态服务 `python -m http.server 8080`（或类似）
3. 验证：
   - 5 个页面正常显示
   - 课程筛选、详情跳转
   - 咨询表单提交，数据写入 SQLite
   - AI 客服弹窗可用（Coze WebSDK 加载）
   - 响应式：Chrome/Edge 桌面 + DevTools 移动端模拟

### 步骤 5：文档
1. 编写根 `README.md`（启动方式、技术栈、目录说明）
2. 验证所有 PRD MVP 项 ✅

---

## 十、启动方式（Windows）

### 后端
```bat
cd c:\Users\a\Desktop\project
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python backend\seed_data.py
python backend\app.py
```
后端运行在 `http://127.0.0.1:8000`，Swagger 文档在 `/docs`。

### 前端
```bat
cd c:\Users\a\Desktop\project\frontend
python -m http.server 8080
```
访问 `http://127.0.0.1:8080`。

`start_backend.bat` / `start_frontend.bat` 自动化上述流程。

---

## 十一、假设与决策

| 决策点 | 选择 | 理由 |
|---|---|---|
| 前端构建工具 | 无（CDN） | 用户已选定"Vue3 CDN 轻量方案"，MVP 阶段无需 npm/Vite |
| UI 框架 | Element Plus | SOP 明确指定 |
| 后端框架 | FastAPI | SOP 明确指定，自动生成 Swagger 文档 |
| ORM | SQLAlchemy 2.0 | SOP 可选，使用 Pythonic 写法 |
| 路由方案 | Hash 路由 | CDN 方案下无需后端路由配合，hash 路由最简单 |
| Coze 集成 | WebSDK 模式 | s.html 已提供 bot_id/token，直接复用 |
| 课程详情"目录" | 后端存 JSON 字符串 | 灵活支持多级章节 |
| 响应式断点 | 768px（平板）、1024px（桌面） | 主流响应式方案 |

---

## 十二、验证清单（MVP 验收）

逐项对应 PRD 第 9 节：

- [ ] ✅ 首页（Banner、热门课程、优势、师资、评价、关于）
- [ ] ✅ 课程列表（筛选、搜索、卡片展示）
- [ ] ✅ 课程详情（基础信息、介绍、目录、咨询按钮）
- [ ] ✅ 师资介绍（头像、姓名、职位、经验、擅长、介绍）
- [ ] ✅ 关于我们（公司介绍、理念、联系方式、优势）
- [ ] ✅ 免费咨询（表单字段、提交到 SQLite）
- [ ] ✅ AI 客服入口（Coze WebSDK 可用）

---

## 十三、风险与注意事项

1. **Coze token 失效**：s.html 中的 token 可能有有效期限制，使用时若失效需更新。
2. **CDN 访问**：国内访问 unpkg 可能慢，使用 cdnjs 或 bootcdn 备份方案。
3. **CORS**：前端静态服务与后端端口不同，必须正确配置 CORS。
4. **数据库初始化**：`seed_data.py` 需幂等（仅在表为空时插入数据），避免重复插入。
5. **响应式**：移动端布局需特别测试，Element Plus 组件在窄屏可能有溢出。

---

完成上述步骤后，网站即可达到 PRD 中 MVP 阶段的所有要求，并具备后续接入真实 Coze API、扩展 V2/V3 功能的可扩展性。
