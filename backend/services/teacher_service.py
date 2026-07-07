"""师资业务逻辑"""
from typing import List, Optional
from sqlalchemy.orm import Session
from backend import models, schemas


def list_teachers(db: Session) -> List[models.Teacher]:
    """获取所有师资"""
    return db.query(models.Teacher).order_by(models.Teacher.id.asc()).all()


def get_teacher(db: Session, teacher_id: int) -> Optional[models.Teacher]:
    """根据 ID 获取师资"""
    return db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()


def create_teacher(
    db: Session, data: schemas.TeacherCreate
) -> models.Teacher:
    """新增师资"""
    teacher = models.Teacher(**data.model_dump())
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


def update_teacher(
    db: Session, teacher_id: int, data: schemas.TeacherUpdate
) -> Optional[models.Teacher]:
    """更新师资"""
    teacher = get_teacher(db, teacher_id)
    if not teacher:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(teacher, key, value)
    db.commit()
    db.refresh(teacher)
    return teacher


def delete_teacher(db: Session, teacher_id: int) -> bool:
    """删除师资"""
    teacher = get_teacher(db, teacher_id)
    if not teacher:
        return False
    db.delete(teacher)
    db.commit()
    return True
