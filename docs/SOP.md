## `AI智能体课程咨询网站_SOP开发规范.md`

```
# AI智能体课程咨询网站 SOP开发规范


版本：

V1.0


项目技术：

Vue3 + Python + SQLite + Coze Agent


---

# 1. 项目开发规范


## 目录结构
```

AI-Agent-Course

├── frontend

│   ├── src
 │   │
 │   ├── components
 │   │
 │   ├── views
 │   │
 │   ├── router
 │   │
 │   └── api

├── backend

│   ├── app.py
 │   ├── database.py
 │   ├── models.py
 │   └── services

├── database

│   └── ai_course.db

├── docs

│   ├── PRD.md
 │   └── SOP.md

└── README.md

```
---

# 2. 前端开发规范


技术：

Vue3


规范：

采用：

Composition API


组件命名：

PascalCase


例如：
```

CourseCard.vue

AiChat.vue

TeacherCard.vue

```
---

# 3. 页面规范


views目录：
```

Home.vue

CourseList.vue

CourseDetail.vue

Consult.vue

About.vue

```
---

# 4. CSS规范


采用：

Scoped CSS


例如：

```vue
<style scoped>

.course-card{

}

</style>
```

设计原则：

- 简洁
- 高复用
- 响应式

------

# 5. AI客服开发规范

组件：

```
AiChat.vue
```

功能：

负责：

- 聊天窗口
- 消息显示
- 输入发送

接口：

```
POST

/chat
```

请求：

```
{
"message":"课程多少钱"
}
```

返回：

```
{
"reply":"课程价格2999"
}
```

当前：

Mock

未来：

接入Coze API。

------

# 6. Python规范

Python版本：

> =3.11

代码规范：

PEP8

命名：

函数：

snake_case

类：

PascalCase

例如：

```
def get_course():

class CourseService:
```

------

# 7. SQLite规范

数据库：

sqlite3

ORM：

可选：

SQLAlchemy

表命名：

小写英文

例如：

```
courses

teachers

consultations
```

------

# 8. API规范

统一格式：

请求：

```
GET

POST

PUT

DELETE
```

返回：

JSON

成功：

```
{
"code":200,
"data":{}
}
```

失败：

```
{
"code":500,
"message":"error"
}
```

------

# 9. Git规范

分支：

```
main

develop

feature
```

提交格式：

新增：

```
feat:
```

修改：

```
fix:
```

文档：

```
docs:
```

示例：

```
feat:add course page
```

------

# 10. 开发流程 SOP

## Step1 产品确认

完成：

- PRD确认
- 页面确认
- 数据结构确认

------

## Step2 前端开发

顺序：

1 首页

2 课程列表

3 课程详情

4 咨询页面

5 AI客服组件

------

## Step3 数据库开发

创建：

SQLite

初始化：

课程数据

教师数据

------

## Step4 AI接入

阶段1：

Mock

阶段2：

Coze API

阶段3：

智能推荐

------

## Step5 测试

测试内容：

页面：

- 是否正常显示

功能：

- 表单提交
- 数据保存
- AI聊天

兼容：

Chrome

Edge

------

# 11. 部署规范

前端：

Vite build

生成：

```
dist
```

部署：

Nginx

------

Python：

启动：

```
python app.py
```

------

数据库：

SQLite文件直接部署。

------

# 12. 安全规范

必须：

- API Key禁止提交Git
- 使用.env管理
- 用户手机号脱敏

.env:

```
COZE_API_KEY=
```

------

# 13. 后续扩展规范

支持：

- 后台管理系统
- 用户体系
- 支付系统
- AI学习助手
- 企业知识库