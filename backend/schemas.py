"""Pydantic 数据模型（请求/响应 Schema）"""
from datetime import datetime
from typing import Generic, List, Optional, TypeVar

T = TypeVar("T")
from pydantic import BaseModel, Field, field_validator


# ===== 课程 =====
class CourseBase(BaseModel):
    title: str
    cover: Optional[str] = None
    teacher: Optional[str] = None
    duration: Optional[str] = None
    price: float = 0.0
    level: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    student_count: int = 0


class CourseOut(CourseBase):
    id: int
    create_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class CourseUpdate(BaseModel):
    """课程更新（所有字段可选）"""
    title: Optional[str] = None
    cover: Optional[str] = None
    teacher: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = None
    level: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    student_count: Optional[int] = None


class CourseCreate(CourseBase):
    """创建课程"""
    pass


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    pages: int


# ===== 师资 =====
class TeacherBase(BaseModel):
    name: str
    avatar: Optional[str] = None
    position: Optional[str] = None
    experience: Optional[str] = None
    specialty: Optional[str] = None
    intro: Optional[str] = None


class TeacherOut(TeacherBase):
    id: int

    class Config:
        from_attributes = True


class TeacherUpdate(BaseModel):
    """师资更新"""
    name: Optional[str] = None
    avatar: Optional[str] = None
    position: Optional[str] = None
    experience: Optional[str] = None
    specialty: Optional[str] = None
    intro: Optional[str] = None


class TeacherCreate(TeacherBase):
    """创建师资"""
    pass


# ===== Banner =====
class BannerBase(BaseModel):
    image: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    button_text: Optional[str] = "立即学习"
    url: Optional[str] = "#"
    sort_order: int = 0


class BannerOut(BannerBase):
    id: int

    class Config:
        from_attributes = True


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    image: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    button_text: Optional[str] = None
    url: Optional[str] = None
    sort_order: Optional[int] = None


# ===== 咨询 =====
class ConsultationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="姓名")
    phone: str = Field(..., min_length=11, max_length=20, description="手机号")
    wechat: Optional[str] = Field(None, max_length=50, description="微信")
    course: Optional[str] = Field(None, max_length=200, description="咨询课程")
    message: Optional[str] = Field(None, description="留言内容")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # 简单手机号校验
        if not v.isdigit():
            raise ValueError("手机号必须为数字")
        if len(v) < 11:
            raise ValueError("手机号至少 11 位")
        return v


class ConsultationOut(BaseModel):
    id: int
    name: str
    phone: str
    wechat: Optional[str] = None
    course: Optional[str] = None
    message: Optional[str] = None
    status: str = "pending"
    create_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class ConsultationStatusUpdate(BaseModel):
    status: str = Field(..., description="pending/contacted/closed")


# ===== 评价 =====
class ReviewBase(BaseModel):
    name: str
    avatar: Optional[str] = None
    content: str
    course: Optional[str] = None
    rating: int = 5


class ReviewOut(ReviewBase):
    id: int
    create_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    content: Optional[str] = None
    course: Optional[str] = None
    rating: Optional[int] = None


# ===== AI 聊天 =====
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="用户消息")


class ChatResponse(BaseModel):
    reply: str


# ===== 后台管理 =====
class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    message: str = "登录成功"


# ===== 统一响应 =====
class ApiResponse(BaseModel):
    code: int = 200
    data: Optional[object] = None
    message: Optional[str] = None
