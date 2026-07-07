"""
数据库种子数据初始化脚本

执行：
    python backend/seed_data.py

幂等：仅在表为空时插入。
"""
import sys
import io
from pathlib import Path

# 修复 Windows 控制台 emoji 编码问题
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")
    except Exception:
        pass

# 允许从项目根目录直接运行
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.database import SessionLocal, init_db, Base, engine
from backend import models


# ===== 课程数据 =====
COURSES_DATA = [
    {
        "title": "AI Agent 智能体开发实战",
        "cover": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20Agent%20intelligent%20robot%20developing%2C%20futuristic%20blue%20circuit%20board%2C%20hologram%20interface%2C%20tech%20style%2C%20minimalist%20illustration&image_size=landscape_16_9",
        "teacher": "张老师",
        "duration": "30小时",
        "price": 2999.0,
        "level": "高级",
        "description": "从零到一掌握 AI Agent 全栈开发，包括大模型对接、工具调用、工作流设计、多智能体协作等核心能力。",
        "category": "Agent 开发",
        "student_count": 1856,
        "content": '{"objectives":["掌握 LLM API 调用与 Prompt 设计","理解 Agent 架构与 ReAct 推理","熟练使用 LangChain / Coze 开发框架","独立完成企业级 Agent 项目"],"tech":["Python 3.11+","LangChain / Coze SDK","Function Calling","RAG 检索增强","向量数据库"],"projects":["智能客服 Agent","自动化办公 Agent","多 Agent 协作系统","企业知识库助手"],"outline":[{"chapter":"第一章 AI Agent 基础","topics":["什么是 AI Agent","Agent 与 LLM 的关系","主流 Agent 框架概览"]},{"chapter":"第二章 Prompt 工程","topics":["Prompt 设计原则","Few-shot 与 Chain-of-Thought","Function Calling 实战"]},{"chapter":"第三章 工作流设计","topics":["Agent 工作流模式","状态机与决策树","LangGraph 实战"]},{"chapter":"第四章 企业智能体开发","topics":["多 Agent 协作","权限与安全","性能优化","部署与监控"]}]}',
    },
    {
        "title": "大模型应用开发入门",
        "cover": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Large%20Language%20Model%20application%20development%2C%20neural%20network%20visualization%2C%20blue%20gradient%20background%2C%20modern%20tech%20style%2C%20minimalist&image_size=landscape_16_9",
        "teacher": "李老师",
        "duration": "24小时",
        "price": 1999.0,
        "level": "初级",
        "description": "零基础入门 LLM 应用开发，系统讲解 OpenAI/Coze/通义千问等大模型 API 使用与 Web 应用集成。",
        "category": "大模型应用",
        "student_count": 3420,
        "content": '{"objectives":["理解 LLM 基本原理","熟练调用主流大模型 API","开发对话类 Web 应用","掌握流式输出与上下文管理"],"tech":["Python / JavaScript","OpenAI / Coze API","Vue3 前端","FastAPI 后端","流式响应"],"projects":["AI 聊天机器人","文档问答助手","内容生成工具","智能写作平台"],"outline":[{"chapter":"第一章 LLM 基础","topics":["什么是大语言模型","主流模型对比","API Key 申请"]},{"chapter":"第二章 API 实战","topics":["OpenAI API 调用","Prompt 编写技巧","流式输出实现"]},{"chapter":"第三章 Web 集成","topics":["FastAPI 搭建后端","Vue3 前端对接","WebSocket 实时通信"]},{"chapter":"第四章 进阶应用","topics":["上下文管理","Function Calling 入门","应用部署"]}]}',
    },
    {
        "title": "Prompt 工程精通",
        "cover": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Prompt%20engineering%20concept%2C%20AI%20chat%20interface%20with%20text%20bubbles%2C%20light%20blue%20tech%20style%2C%20clean%20illustration&image_size=landscape_16_9",
        "teacher": "王老师",
        "duration": "18小时",
        "price": 1499.0,
        "level": "中级",
        "description": "系统学习 Prompt 工程方法论，从基础结构到高级推理模式，全面提升与大模型协作的能力。",
        "category": "大模型应用",
        "student_count": 2156,
        "content": '{"objectives":["掌握 Prompt 设计核心原则","熟练运用 Chain-of-Thought 等推理模式","理解 Few-shot / Zero-shot 策略","提升 LLM 输出质量与稳定性"],"tech":["Prompt 模式库","CoT 思维链","ReAct 框架","Self-Consistency","Tree of Thoughts"],"projects":["智能问答系统 Prompt 优化","代码生成助手","多轮对话设计","复杂任务分解"],"outline":[{"chapter":"第一章 Prompt 基础","topics":["Prompt 结构与角色设定","指令清晰度原则","输出格式控制"]},{"chapter":"第二章 推理模式","topics":["Chain-of-Thought","ReAct","Self-Consistency"]},{"chapter":"第三章 高级技巧","topics":["Few-shot 示例工程","Prompt 链式调用","自动 Prompt 优化"]}]}',
    },
    {
        "title": "自动化工作流实战",
        "cover": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Automation%20workflow%20concept%2C%20connected%20nodes%20and%20gears%2C%20blue%20tech%20illustration%2C%20minimalist%20style&image_size=landscape_16_9",
        "teacher": "赵老师",
        "duration": "20小时",
        "price": 1799.0,
        "level": "中级",
        "description": "掌握 n8n / Dify / Coze Workflow 等主流工作流工具，结合 AI 实现企业级自动化场景。",
        "category": "自动化工作流",
        "student_count": 1432,
        "content": '{"objectives":["理解工作流引擎原理","熟练使用 n8n / Dify / Coze Workflow","设计复杂业务自动化流程","结合 AI 节点实现智能自动化"],"tech":["n8n","Dify","Coze Workflow","Webhook","API 集成"],"projects":["客户自动跟进系统","内容生产流水线","数据 ETL 自动化","智能审批流程"],"outline":[{"chapter":"第一章 工作流基础","topics":["什么是工作流","主流工具对比","节点与连线"]},{"chapter":"第二章 工具实战","topics":["n8n 入门","Dify 进阶","Coze Workflow"]},{"chapter":"第三章 AI 集成","topics":["AI 节点应用","条件分支","异常处理"]}]}',
    },
    {
        "title": "企业 AI 落地训练营",
        "cover": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Enterprise%20AI%20transformation%2C%20office%20building%20with%20holographic%20AI%20interface%2C%20blue%20corporate%20tech%20style&image_size=landscape_16_9",
        "teacher": "陈老师",
        "duration": "40小时",
        "price": 4999.0,
        "level": "高级",
        "description": "面向企业 CTO / 技术负责人的 AI 转型实战课，涵盖战略规划、组织建设、技术选型与 ROI 评估。",
        "category": "企业 AI 落地",
        "student_count": 568,
        "content": '{"objectives":["制定企业 AI 战略","评估 AI 项目 ROI","搭建 AI 中台","管理 AI 团队与项目"],"tech":["企业架构","知识库 RAG","私有化部署","LLMOps","项目管理"],"projects":["企业知识库搭建","AI 客服系统落地","内部 Copilot 开发","AI 转型规划"],"outline":[{"chapter":"第一章 AI 战略","topics":["企业 AI 现状","转型路径","ROI 评估"]},{"chapter":"第二章 技术中台","topics":["模型选型","RAG 架构","LLMOps 体系"]},{"chapter":"第三章 落地实战","topics":["知识库项目","客服 Agent","内部助手"]},{"chapter":"第四章 团队建设","topics":["AI 团队搭建","人才培养","项目治理"]}]}',
    },
    {
        "title": "RAG 知识库构建",
        "cover": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=RAG%20retrieval%20augmented%20generation%20concept%2C%20document%20database%20and%20AI%20brain%2C%20blue%20tech%20style&image_size=landscape_16_9",
        "teacher": "孙老师",
        "duration": "22小时",
        "price": 2299.0,
        "level": "中级",
        "description": "深入学习 RAG 检索增强生成技术，从文档处理、向量检索到端到端知识库问答系统开发。",
        "category": "大模型应用",
        "student_count": 1247,
        "content": '{"objectives":["理解 RAG 原理与架构","掌握文档解析与切片","熟练使用向量数据库","构建端到端知识库系统"],"tech":["LangChain","ChromaDB / Milvus","Embedding 模型","文档解析","检索排序"],"projects":["企业文档问答","学术论文助手","法律合同检索","医疗知识库"],"outline":[{"chapter":"第一章 RAG 基础","topics":["什么是 RAG","RAG vs Fine-tuning","RAG 架构概览"]},{"chapter":"第二章 文档处理","topics":["文档解析","文本切片策略","向量化"]},{"chapter":"第三章 检索增强","topics":["向量检索","混合检索","ReRank 重排序"]},{"chapter":"第四章 端到端实现","topics":["LangChain 实战","性能优化","评估体系"]}]}',
    },
]


# ===== 师资数据 =====
TEACHERS_DATA = [
    {
        "name": "张老师",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20male%20tech%20expert%20portrait%2C%20glasses%2C%20suit%2C%20light%20blue%20background%2C%20clean%20style&image_size=square_hd",
        "position": "资深 AI 架构师",
        "experience": "10年经验",
        "specialty": "AI Agent、LLM 应用、大模型架构",
        "intro": "前 BAT 大厂 AI 平台技术负责人，主导过多个亿级用户 AI 产品。精通 LLM 架构设计与 Agent 系统研发，著有《大模型应用开发实战》。",
    },
    {
        "name": "李老师",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20female%20tech%20expert%20portrait%2C%20friendly%20smile%2C%20light%20blue%20background%2C%20clean%20style&image_size=square_hd",
        "position": "大模型应用专家",
        "experience": "8年经验",
        "specialty": "LLM API、对话系统、Web 集成",
        "intro": "前知名 AI 创业公司技术合伙人，擅长把复杂 AI 能力产品化。已帮助 500+ 学员完成 LLM 应用从 0 到 1 开发。",
    },
    {
        "name": "王老师",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20male%20tech%20expert%20portrait%2C%20beard%2C%20casual%20shirt%2C%20light%20blue%20background%2C%20clean%20style&image_size=square_hd",
        "position": "Prompt 工程专家",
        "experience": "5年经验",
        "specialty": "Prompt Engineering、推理优化",
        "intro": "前 OpenAI 合作团队 Prompt 工程师，专注于 CoT、ReAct 等推理模式研究。GitHub 拥有 10k+ star 的 Prompt 工具库。",
    },
    {
        "name": "赵老师",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20male%20tech%20expert%20portrait%2C%20glasses%2C%20polo%20shirt%2C%20light%20blue%20background%2C%20clean%20style&image_size=square_hd",
        "position": "自动化领域专家",
        "experience": "7年经验",
        "specialty": "n8n、Dify、Coze Workflow、LLMOps",
        "intro": "资深企业 AI 落地顾问，曾为多家 500 强搭建自动化工作流平台。精通 n8n、Dify 等工具的复杂场景应用。",
    },
]


# ===== Banner 数据 =====
BANNERS_DATA = [
    {
        "image": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20Agent%20development%20banner%2C%20blue%20gradient%20tech%20background%2C%20futuristic%20circuit%20pattern%2C%20modern%20style&image_size=landscape_16_9",
        "title": "开启 AI Agent 开发之旅",
        "subtitle": "从零掌握智能体应用开发",
        "button_text": "立即学习",
        "url": "#/courses",
        "sort_order": 1,
    },
    {
        "image": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Large%20language%20model%20banner%2C%20blue%20tech%20gradient%2C%20neural%20network%20pattern%2C%20modern%20style&image_size=landscape_16_9",
        "title": "大模型应用开发",
        "subtitle": "系统学习 LLM 应用开发全流程",
        "button_text": "了解课程",
        "url": "#/courses",
        "sort_order": 2,
    },
    {
        "image": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Enterprise%20AI%20transformation%20banner%2C%20blue%20corporate%20tech%2C%20city%20skyline%20with%20hologram%2C%20modern%20style&image_size=landscape_16_9",
        "title": "企业 AI 落地",
        "subtitle": "助力企业智能化转型",
        "button_text": "免费咨询",
        "url": "#/consult",
        "sort_order": 3,
    },
]


# ===== 评价数据 =====
REVIEWS_DATA = [
    {
        "name": "王同学",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Happy%20young%20Asian%20student%20avatar%2C%20light%20blue%20background%2C%20cartoon%20style&image_size=square_hd",
        "content": "张老师的 Agent 课程太赞了！从原理到实战讲得非常清楚，跟着做完项目后我成功拿到了 AI 工程师的 offer。",
        "course": "AI Agent 智能体开发实战",
        "rating": 5,
    },
    {
        "name": "李女士",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20female%20avatar%2C%20light%20blue%20background%2C%20cartoon%20style&image_size=square_hd",
        "content": "李老师的大模型入门课是我入行 AI 的启蒙课，通俗易懂，项目实战让我快速上手。现在已经在公司主导 AI 项目。",
        "course": "大模型应用开发入门",
        "rating": 5,
    },
    {
        "name": "陈经理",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20male%20manager%20avatar%2C%20light%20blue%20background%2C%20cartoon%20style&image_size=square_hd",
        "content": "赵老师的工作流课非常实用，学完就用 n8n 给公司搭了客户跟进系统，效率提升了 3 倍，ROI 显著。",
        "course": "自动化工作流实战",
        "rating": 5,
    },
    {
        "name": "刘同学",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Young%20Asian%20student%20avatar%2C%20light%20blue%20background%2C%20cartoon%20style&image_size=square_hd",
        "content": "王老师的 Prompt 课让我对大模型的理解提升了一个层次，特别是 CoT 和 ReAct 模式，工作中直接就用上了。",
        "course": "Prompt 工程精通",
        "rating": 5,
    },
    {
        "name": "周总监",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Senior%20Asian%20tech%20director%20avatar%2C%20light%20blue%20background%2C%20cartoon%20style&image_size=square_hd",
        "content": "陈老师的企业 AI 落地训练营，让我们团队对 AI 转型有了清晰的路径，已经开始按计划推进几个核心项目。",
        "course": "企业 AI 落地训练营",
        "rating": 5,
    },
]


def seed():
    """执行种子数据插入（幂等）"""
    init_db()
    db = SessionLocal()
    try:
        # 课程
        if db.query(models.Course).count() == 0:
            for c in COURSES_DATA:
                db.add(models.Course(**c))
            print(f"  ✅ 插入 {len(COURSES_DATA)} 门课程")

        # 师资
        if db.query(models.Teacher).count() == 0:
            for t in TEACHERS_DATA:
                db.add(models.Teacher(**t))
            print(f"  ✅ 插入 {len(TEACHERS_DATA)} 位师资")

        # Banner
        if db.query(models.Banner).count() == 0:
            for b in BANNERS_DATA:
                db.add(models.Banner(**b))
            print(f"  ✅ 插入 {len(BANNERS_DATA)} 个 Banner")

        # 评价
        if db.query(models.Review).count() == 0:
            for r in REVIEWS_DATA:
                db.add(models.Review(**r))
            print(f"  ✅ 插入 {len(REVIEWS_DATA)} 条评价")

        db.commit()
        print("\n🎉 种子数据初始化完成！\n")
    except Exception as e:
        db.rollback()
        print(f"❌ 初始化失败：{e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("\n🌱 开始初始化种子数据...\n")
    seed()
