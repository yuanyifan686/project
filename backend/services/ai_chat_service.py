"""AI 聊天服务：优先 Coze API，回退 Mock"""
import os
import random

import httpx

# 模拟回复模板（关键词 → 回复）
_MOCK_REPLIES = {
    "价格": "我们的 AI 课程价格区间在 1499-4999 元不等，\n"
            "其中 'Prompt 工程精通' 1499 元，\n"
            "'大模型应用开发入门' 1999 元，\n"
            "'AI Agent 智能体开发实战' 2999 元，\n"
            "'企业 AI 落地训练营' 4999 元。\n"
            "具体可查看课程详情或留下联系方式，顾问会为您推荐合适课程。",
    "课程": "我们提供 6 门 AI 课程，涵盖：\n"
            "1. 大模型应用开发入门\n"
            "2. Prompt 工程精通\n"
            "3. AI Agent 智能体开发实战\n"
            "4. 自动化工作流实战\n"
            "5. RAG 知识库构建\n"
            "6. 企业 AI 落地训练营\n"
            "请问您对哪门课程感兴趣？",
    "学习路线": "推荐学习路线：\n"
                "1️⃣ 入门：大模型应用开发入门\n"
                "2️⃣ 进阶：Prompt 工程精通\n"
                "3️⃣ 实战：AI Agent 智能体开发实战\n"
                "4️⃣ 高阶：企业 AI 落地训练营\n"
                "按顺序学习可以系统掌握 AI 应用开发能力。",
    "入门": "零基础推荐从《大模型应用开发入门》开始，\n"
            "24 小时系统讲解 LLM 基础、API 调用、应用搭建，\n"
            "价格 1999 元，李老师主讲。",
    "讲师": "我们的讲师团队包括：\n"
            "• 张老师 - 资深 AI 架构师（10 年经验）\n"
            "• 李老师 - 大模型应用专家（8 年经验）\n"
            "• 王老师 - Prompt 工程专家（5 年经验）\n"
            "• 赵老师 - 自动化领域专家（7 年经验）",
    "时间": "课程开课时间灵活，随到随学。\n"
            "VIP 班每月 1 号开课，\n"
            "普通班可随时加入学习。",
    "咨询": "您可以：\n"
            "1️⃣ 在「免费咨询」页面留下信息，顾问 24h 内联系您\n"
            "2️⃣ 直接与我对话解答疑惑\n"
            "3️⃣ 访问课程详情页查看大纲",
    "你好": "您好！我是 AI 课程智能助手 🤖\n"
            "可以为您介绍：\n"
            "• 课程内容与价格\n"
            "• 学习路线推荐\n"
            "• 师资介绍\n"
            "• 开课时间\n"
            "请问您想了解哪方面？",
    "hi": "您好！我是 AI 课程智能助手，请问有什么可以帮您？",
    "帮助": "我可以帮您：\n"
            "1. 介绍课程（回复「课程」）\n"
            "2. 查看价格（回复「价格」）\n"
            "3. 推荐学习路线（回复「学习路线」）\n"
            "4. 介绍讲师（回复「讲师」）\n"
            "5. 安排咨询（回复「咨询」）",
}

_DEFAULT_REPLIES = [
    "我理解您的问题，为您推荐查看课程详情或联系人工顾问。",
    "您可以尝试咨询：课程价格、学习路线、讲师、开课时间等。",
    "请告诉我您感兴趣的方面（如：价格、课程、讲师、学习路线）。",
]

COZE_API_BASE = os.getenv("COZE_API_BASE", "https://api.coze.cn")


def mock_chat(message: str) -> str:
    """根据关键词返回 mock 回复"""
    msg = message.strip()
    for kw, reply in _MOCK_REPLIES.items():
        if kw in msg:
            return reply
    return random.choice(_DEFAULT_REPLIES)


def _extract_coze_reply(data: dict) -> str:
    if isinstance(data.get("data"), dict):
        messages = data["data"].get("messages") or []
        for item in reversed(messages):
            if item.get("role") == "assistant" and item.get("content"):
                return str(item["content"])
    if data.get("messages"):
        for item in reversed(data["messages"]):
            if item.get("role") == "assistant" and item.get("content"):
                return str(item["content"])
    return ""


def _call_coze_api(message: str) -> str:
    api_key = os.getenv("COZE_API_KEY", "").strip()
    bot_id = os.getenv("COZE_BOT_ID", "").strip()
    if not api_key or not bot_id:
        return ""

    url = f"{COZE_API_BASE}/v3/chat"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "bot_id": bot_id,
        "user_id": "web_user",
        "stream": False,
        "auto_save_history": False,
        "additional_messages": [
            {"role": "user", "content": message, "content_type": "text"}
        ],
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            reply = _extract_coze_reply(resp.json())
            return reply.strip()
    except Exception:
        return ""


def chat_with_coze(message: str) -> str:
    """服务端代理 Coze，失败时回退 Mock"""
    reply = _call_coze_api(message)
    if reply:
        return reply
    return mock_chat(message)


def get_chat_mode() -> str:
    api_key = os.getenv("COZE_API_KEY", "").strip()
    bot_id = os.getenv("COZE_BOT_ID", "").strip()
    return "coze" if api_key and bot_id else "mock"