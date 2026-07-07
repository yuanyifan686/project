"""
AI 智能体课程咨询网站 - FastAPI 主入口

启动：
    python backend/app.py
或：
    uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
"""
import os
import sys
import io
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session

# 修复 Windows 控制台 emoji 编码（避免替换 stdout 导致 uvicorn 崩溃）
if sys.platform == "win32":
    for _stream in (sys.stdout, sys.stderr):
        if hasattr(_stream, "reconfigure"):
            try:
                _stream.reconfigure(encoding="utf-8")
            except Exception:
                pass

# 把项目根目录加入 sys.path，兼容直接 `python backend/app.py` 启动
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# 加载 .env
load_dotenv(BASE_DIR / ".env")

from backend.database import engine, get_db, init_db, Base  # noqa: E402
from backend import models  # noqa: E402,F401
from backend.auth import create_access_token, decode_access_token  # noqa: E402
from backend.schemas import (  # noqa: E402
    ConsultationCreate,
    ConsultationOut,
    ConsultationStatusUpdate,
    CourseOut,
    CourseCreate,
    CourseUpdate,
    TeacherOut,
    TeacherCreate,
    TeacherUpdate,
    BannerOut,
    BannerCreate,
    BannerUpdate,
    ReviewOut,
    ReviewCreate,
    ReviewUpdate,
    ChatRequest,
    AdminLoginRequest,
)
from backend.services import (  # noqa: E402
    course_service,
    teacher_service,
    banner_service,
    review_service,
    consultation_service,
    ai_chat_service,
)


def _get_cors_origins() -> list[str]:
    """CORS 来源：环境变量 + 本地开发默认项"""
    defaults = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ]
    extra = os.getenv("ALLOWED_ORIGINS", "")
    if extra:
        defaults.extend(
            o.strip() for o in extra.split(",") if o.strip()
        )
    # 去重保序
    seen = set()
    result = []
    for o in defaults:
        if o not in seen:
            seen.add(o)
            result.append(o)
    return result


# ===== 应用生命周期 =====
@asynccontextmanager
async def lifespan(_app: FastAPI):
    """启动时初始化数据库表，并按需写入种子数据"""
    init_db()
    print("[INFO] 数据库表已初始化/已存在")
    if os.getenv("SEED_ON_STARTUP", "true").lower() in ("1", "true", "yes"):
        try:
            from backend.seed_data import seed

            seed()
            print("[INFO] 种子数据检查完成")
        except Exception as e:
            print(f"[WARN] 种子数据初始化跳过或失败: {e}")
    yield


# ===== 应用初始化 =====
app = FastAPI(
    title="AI 智能体课程咨询网站 API",
    description="MVP 阶段接口文档",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS（生产通过 ALLOWED_ORIGINS 配置 Render 域名）
app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== 统一响应封装 =====
def ok(data=None, message: str = "success"):
    return {"code": 200, "data": data, "message": message}


def fail(message: str, code: int = 500):
    return {"code": code, "data": None, "message": message}


# ===== 接口 =====
@app.get("/api/health")
def health():
    """健康检查（前后端一体化部署时，根路径 / 由静态站点托管）"""
    return ok({
        "name": "AI 智能体课程咨询网站 API",
        "version": "1.0.0",
        "docs": "/docs",
    })


@app.get("/api/banners", response_model=None)
def get_banners(db: Session = Depends(get_db)):
    banners = banner_service.list_banners(db)
    return ok([BannerOut.model_validate(b).model_dump() for b in banners])


@app.get("/api/courses", response_model=None)
def get_courses(
    category: Optional[str] = Query(None, description="课程分类"),
    level: Optional[str] = Query(None, description="难度"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    page: Optional[int] = Query(None, ge=1, description="页码（传入则分页）"),
    page_size: int = Query(12, ge=1, le=50, description="每页条数"),
    db: Session = Depends(get_db),
):
    if page is not None:
        items, total = course_service.list_courses_paginated(
            db, page, page_size, category, level, keyword
        )
        pages = (total + page_size - 1) // page_size if total else 0
        return ok({
            "items": [CourseOut.model_validate(c).model_dump() for c in items],
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": pages,
        })
    courses = course_service.list_courses(db, category, level, keyword)
    return ok([CourseOut.model_validate(c).model_dump() for c in courses])


@app.get("/api/courses/hot", response_model=None)
def get_hot_courses(limit: int = 6, db: Session = Depends(get_db)):
    courses = course_service.get_hot_courses(db, limit=limit)
    return ok([CourseOut.model_validate(c).model_dump() for c in courses])


@app.get("/api/courses/{course_id}", response_model=None)
def get_course_detail(course_id: int, db: Session = Depends(get_db)):
    course = course_service.get_course(db, course_id)
    if not course:
        return fail("课程不存在", code=404)
    return ok(CourseOut.model_validate(course).model_dump())


@app.get("/api/teachers", response_model=None)
def get_teachers(db: Session = Depends(get_db)):
    teachers = teacher_service.list_teachers(db)
    return ok([TeacherOut.model_validate(t).model_dump() for t in teachers])


@app.get("/api/teachers/{teacher_id}", response_model=None)
def get_teacher_detail(teacher_id: int, db: Session = Depends(get_db)):
    teacher = teacher_service.get_teacher(db, teacher_id)
    if not teacher:
        return fail("师资不存在", code=404)
    return ok(TeacherOut.model_validate(teacher).model_dump())


@app.get("/api/reviews", response_model=None)
def get_reviews(limit: int = 10, db: Session = Depends(get_db)):
    reviews = review_service.list_reviews(db, limit=limit)
    return ok([ReviewOut.model_validate(r).model_dump() for r in reviews])


@app.post("/api/consultations", response_model=None)
def submit_consultation(
    data: ConsultationCreate, db: Session = Depends(get_db)
):
    try:
        record = consultation_service.create_consultation(db, data)
        return ok(
            {
                "id": record.id,
                "name": record.name,
                "create_time": record.create_time.isoformat()
                if record.create_time
                else None,
            },
            message="提交成功，顾问会尽快联系您！",
        )
    except Exception as e:
        return fail(f"提交失败：{str(e)}")


@app.post("/api/chat", response_model=None)
def chat(req: ChatRequest):
    """AI 聊天接口（当前 Mock，预留 Coze API 替换）"""
    reply = ai_chat_service.chat_with_coze(req.message)
    return ok({"reply": reply})


@app.get("/api/chat/config", response_model=None)
def get_chat_config():
    """AI 客服公开配置（不含密钥，聊天走服务端代理）"""
    return ok({
        "mode": ai_chat_service.get_chat_mode(),
        "proxy": True,
    })


# ===== 后台管理接口 =====
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")


def require_admin(authorization: Optional[str] = Header(None)) -> str:
    """FastAPI 依赖：校验管理员 JWT"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未授权，请先登录")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        return decode_access_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="登录已过期，请重新登录")


@app.post("/api/admin/login", response_model=None)
def admin_login(data: AdminLoginRequest):
    """后台管理登录，返回 JWT"""
    if data.username == ADMIN_USERNAME and data.password == ADMIN_PASSWORD:
        token = create_access_token(data.username)
        return ok({
            "token": token,
            "username": data.username,
            "expires_in": int(os.getenv("JWT_EXPIRE_HOURS", "24")) * 3600,
        })
    return fail("用户名或密码错误", code=401)


@app.get("/api/admin/info", response_model=None)
def admin_info(_admin: str = Depends(require_admin)):
    """校验 token 是否有效"""
    return ok({"username": _admin})


# ----- 课程管理 -----
@app.get("/api/admin/courses", response_model=None)
def admin_list_courses(
    keyword: Optional[str] = None,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    rows = course_service.list_courses_admin(db, keyword=keyword)
    return ok([CourseOut.model_validate(r).model_dump() for r in rows])


@app.post("/api/admin/courses", response_model=None)
def admin_create_course(
    data: CourseCreate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = course_service.create_course(db, data)
    return ok(CourseOut.model_validate(course).model_dump(), message="创建成功")


@app.put("/api/admin/courses/{course_id}", response_model=None)
def admin_update_course(
    course_id: int,
    data: CourseUpdate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = course_service.update_course(db, course_id, data)
    if not course:
        return fail("课程不存在", code=404)
    return ok(CourseOut.model_validate(course).model_dump(), message="更新成功")


@app.delete("/api/admin/courses/{course_id}", response_model=None)
def admin_delete_course(
    course_id: int,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if course_service.delete_course(db, course_id):
        return ok(message="删除成功")
    return fail("课程不存在", code=404)


# ----- 师资管理 -----
@app.get("/api/admin/teachers", response_model=None)
def admin_list_teachers(
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    teachers = teacher_service.list_teachers(db)
    return ok([TeacherOut.model_validate(t).model_dump() for t in teachers])


@app.post("/api/admin/teachers", response_model=None)
def admin_create_teacher(
    data: TeacherCreate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    teacher = teacher_service.create_teacher(db, data)
    return ok(TeacherOut.model_validate(teacher).model_dump(), message="创建成功")


@app.put("/api/admin/teachers/{teacher_id}", response_model=None)
def admin_update_teacher(
    teacher_id: int,
    data: TeacherUpdate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    teacher = teacher_service.update_teacher(db, teacher_id, data)
    if not teacher:
        return fail("师资不存在", code=404)
    return ok(TeacherOut.model_validate(teacher).model_dump(), message="更新成功")


@app.delete("/api/admin/teachers/{teacher_id}", response_model=None)
def admin_delete_teacher(
    teacher_id: int,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if teacher_service.delete_teacher(db, teacher_id):
        return ok(message="删除成功")
    return fail("师资不存在", code=404)


# ----- 咨询记录管理 -----
@app.get("/api/admin/consultations", response_model=None)
def admin_list_consultations(
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 200,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    records = consultation_service.list_consultations(
        db, limit=limit, keyword=keyword, status=status
    )
    return ok([ConsultationOut.model_validate(r).model_dump() for r in records])


@app.patch("/api/admin/consultations/{cid}/status", response_model=None)
def admin_update_consultation_status(
    cid: int,
    data: ConsultationStatusUpdate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    try:
        record = consultation_service.update_consultation_status(
            db, cid, data.status
        )
    except ValueError as e:
        return fail(str(e), code=400)
    if not record:
        return fail("记录不存在", code=404)
    return ok(
        ConsultationOut.model_validate(record).model_dump(),
        message="状态已更新",
    )


@app.delete("/api/admin/consultations/{cid}", response_model=None)
def admin_delete_consultation(
    cid: int,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if consultation_service.delete_consultation(db, cid):
        return ok(message="删除成功")
    return fail("记录不存在", code=404)


# ----- Banner 管理 -----
@app.get("/api/admin/banners", response_model=None)
def admin_list_banners(
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    banners = banner_service.list_banners(db)
    return ok([BannerOut.model_validate(b).model_dump() for b in banners])


@app.post("/api/admin/banners", response_model=None)
def admin_create_banner(
    data: BannerCreate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    banner = banner_service.create_banner(db, data)
    return ok(BannerOut.model_validate(banner).model_dump(), message="创建成功")


@app.put("/api/admin/banners/{banner_id}", response_model=None)
def admin_update_banner(
    banner_id: int,
    data: BannerUpdate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    banner = banner_service.update_banner(db, banner_id, data)
    if not banner:
        return fail("Banner 不存在", code=404)
    return ok(BannerOut.model_validate(banner).model_dump(), message="更新成功")


@app.delete("/api/admin/banners/{banner_id}", response_model=None)
def admin_delete_banner(
    banner_id: int,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if banner_service.delete_banner(db, banner_id):
        return ok(message="删除成功")
    return fail("Banner 不存在", code=404)


# ----- 评价管理 -----
@app.get("/api/admin/reviews", response_model=None)
def admin_list_reviews(
    limit: int = 100,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    reviews = review_service.list_reviews(db, limit=limit)
    return ok([ReviewOut.model_validate(r).model_dump() for r in reviews])


@app.post("/api/admin/reviews", response_model=None)
def admin_create_review(
    data: ReviewCreate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    review = review_service.create_review(db, data)
    return ok(ReviewOut.model_validate(review).model_dump(), message="创建成功")


@app.put("/api/admin/reviews/{review_id}", response_model=None)
def admin_update_review(
    review_id: int,
    data: ReviewUpdate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    review = review_service.update_review(db, review_id, data)
    if not review:
        return fail("评价不存在", code=404)
    return ok(ReviewOut.model_validate(review).model_dump(), message="更新成功")


@app.delete("/api/admin/reviews/{review_id}", response_model=None)
def admin_delete_review(
    review_id: int,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if review_service.delete_review(db, review_id):
        return ok(message="删除成功")
    return fail("评价不存在", code=404)


# ===== 全局异常处理 =====
@app.exception_handler(HTTPException)
def http_exception_handler(_request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=fail(message=exc.detail, code=exc.status_code),
    )


@app.exception_handler(RequestValidationError)
def validation_exception_handler(_request, exc: RequestValidationError):
    errors = exc.errors()
    first = errors[0] if errors else {}
    field = ".".join(str(x) for x in first.get("loc", [])[1:]) or "参数"
    msg = first.get("msg", "参数校验失败")
    return JSONResponse(
        status_code=422,
        content=fail(message=f"{field}: {msg}", code=422),
    )


# ===== 静态资源托管（前后端一体化部署）=====
# 默认使用 frontend/（CDN 版，即开即用）；Docker 生产环境设 USE_DIST=true 使用构建产物
_dist = PROJECT_ROOT / "frontend" / "dist"
_use_dist = os.getenv("USE_DIST", "").lower() in ("1", "true", "yes")
FRONTEND_DIR = (
    _dist
    if _use_dist and _dist.is_dir()
    else PROJECT_ROOT / "frontend"
)
if FRONTEND_DIR.is_dir():
    print(
        f"[INFO] 静态资源目录: {FRONTEND_DIR.resolve()} "
        f"(USE_DIST={_use_dist})"
    )
    app.mount(
        "/",
        StaticFiles(directory=str(FRONTEND_DIR), html=True),
        name="frontend",
    )
else:
    print(f"[WARN] 前端目录不存在: {FRONTEND_DIR.resolve()}")


# ===== 入口 =====
if __name__ == "__main__":
    import uvicorn

    # Render 等平台会注入 PORT；有 PORT 时默认监听 0.0.0.0
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST") or ("0.0.0.0" if os.getenv("PORT") else "127.0.0.1")
    print(f"\n🚀 AI 课程咨询 API 启动中...")
    print(f"📍 地址: http://{host}:{port}")
    print(f"📚 文档: http://{host}:{port}/docs\n")
    uvicorn.run("backend.app:app", host=host, port=port, reload=False)
