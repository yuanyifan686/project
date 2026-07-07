"""SQLAlchemy ORM 模型，对应 PRD 第 7 节数据表设计"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from backend.database import Base


class Course(Base):
    """课程表"""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False, comment="课程名称")
    cover = Column(String(500), comment="课程封面 URL")
    teacher = Column(String(100), comment="讲师")
    duration = Column(String(50), comment="课程时长")
    price = Column(Float, default=0.0, comment="价格（元）")
    level = Column(String(20), comment="难度：初级/中级/高级")
    description = Column(Text, comment="课程简介")
    content = Column(Text, comment="课程详情/目录（JSON 字符串）")
    category = Column(String(50), comment="分类")
    student_count = Column(Integer, default=0, comment="学习人数")
    create_time = Column(DateTime, default=datetime.now)


class Teacher(Base):
    """师资表"""
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, comment="姓名")
    avatar = Column(String(500), comment="头像 URL")
    position = Column(String(100), comment="职位")
    experience = Column(String(50), comment="经验")
    specialty = Column(String(200), comment="擅长方向")
    intro = Column(Text, comment="个人介绍")


class Banner(Base):
    """轮播图表"""
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, autoincrement=True)
    image = Column(String(500), comment="背景图 URL")
    title = Column(String(200), comment="标题")
    subtitle = Column(String(300), comment="副标题")
    button_text = Column(String(50), default="立即学习", comment="按钮文字")
    url = Column(String(300), default="#", comment="跳转地址")
    sort_order = Column(Integer, default=0, comment="排序")


class Consultation(Base):
    """咨询记录表"""
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, comment="姓名")
    phone = Column(String(20), nullable=False, comment="手机号")
    wechat = Column(String(50), comment="微信")
    course = Column(String(200), comment="咨询课程")
    message = Column(Text, comment="留言内容")
    status = Column(
        String(20),
        default="pending",
        comment="状态：pending/contacted/closed",
    )
    create_time = Column(DateTime, default=datetime.now)


class Review(Base):
    """用户评价表"""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, comment="用户名")
    avatar = Column(String(500), comment="头像")
    content = Column(Text, nullable=False, comment="评价内容")
    course = Column(String(200), comment="关联课程")
    rating = Column(Integer, default=5, comment="评分 1-5")
    create_time = Column(DateTime, default=datetime.now)
