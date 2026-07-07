"""课程业务逻辑"""
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from backend import models, schemas


def _apply_course_filters(
    query,
    category: Optional[str] = None,
    level: Optional[str] = None,
    keyword: Optional[str] = None,
):
    if category and category != "全部":
        query = query.filter(models.Course.category == category)
    if level and level != "全部":
        query = query.filter(models.Course.level == level)
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(
            (models.Course.title.like(like))
            | (models.Course.description.like(like))
        )
    return query


def list_courses(
    db: Session,
    category: Optional[str] = None,
    level: Optional[str] = None,
    keyword: Optional[str] = None,
) -> List[models.Course]:
    """获取课程列表，支持筛选（全量，兼容旧接口）"""
    query = _apply_course_filters(db.query(models.Course), category, level, keyword)
    return query.order_by(models.Course.id.desc()).all()


def list_courses_paginated(
    db: Session,
    page: int = 1,
    page_size: int = 12,
    category: Optional[str] = None,
    level: Optional[str] = None,
    keyword: Optional[str] = None,
) -> Tuple[List[models.Course], int]:
    """分页获取课程列表"""
    page = max(page, 1)
    page_size = min(max(page_size, 1), 50)
    query = _apply_course_filters(db.query(models.Course), category, level, keyword)
    total = query.count()
    items = (
        query.order_by(models.Course.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return items, total


def get_course(db: Session, course_id: int) -> Optional[models.Course]:
    """根据 ID 获取课程"""
    return db.query(models.Course).filter(models.Course.id == course_id).first()


def get_hot_courses(db: Session, limit: int = 6) -> List[models.Course]:
    """获取热门课程（按学习人数降序）"""
    return (
        db.query(models.Course)
        .order_by(models.Course.student_count.desc())
        .limit(limit)
        .all()
    )


def create_course(db: Session, data: schemas.CourseBase) -> models.Course:
    """新增课程（管理后台用）"""
    course = models.Course(**data.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def update_course(
    db: Session, course_id: int, data: schemas.CourseUpdate
) -> Optional[models.Course]:
    """更新课程（管理后台用）"""
    course = get_course(db, course_id)
    if not course:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course_id: int) -> bool:
    """删除课程"""
    course = get_course(db, course_id)
    if not course:
        return False
    db.delete(course)
    db.commit()
    return True


def list_courses_admin(
    db: Session, keyword: Optional[str] = None
) -> List[models.Course]:
    """后台管理：获取所有课程（支持搜索）"""
    query = db.query(models.Course)
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(
            (models.Course.title.like(like))
            | (models.Course.teacher.like(like))
            | (models.Course.description.like(like))
        )
    return query.order_by(models.Course.id.desc()).all()
