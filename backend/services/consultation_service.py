"""免费咨询业务逻辑"""
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from backend import models, schemas

CONSULTATION_STATUSES = ("pending", "contacted", "closed")
STATUS_LABELS = {
    "pending": "待处理",
    "contacted": "已联系",
    "closed": "已关闭",
}


def create_consultation(
    db: Session, data: schemas.ConsultationCreate
) -> models.Consultation:
    """保存咨询记录到 SQLite"""
    consultation = models.Consultation(**data.model_dump(), status="pending")
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return consultation


def list_consultations(
    db: Session,
    limit: int = 100,
    keyword: Optional[str] = None,
    status: Optional[str] = None,
) -> List[models.Consultation]:
    """获取咨询记录列表（后台管理用）"""
    query = db.query(models.Consultation)
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(
            (models.Consultation.name.like(like))
            | (models.Consultation.phone.like(like))
            | (models.Consultation.wechat.like(like))
            | (models.Consultation.course.like(like))
        )
    if status and status != "全部":
        query = query.filter(models.Consultation.status == status)
    return query.order_by(models.Consultation.id.desc()).limit(limit).all()


def update_consultation_status(
    db: Session, consultation_id: int, status: str
) -> Optional[models.Consultation]:
    if status not in CONSULTATION_STATUSES:
        raise ValueError(f"无效状态，可选：{', '.join(CONSULTATION_STATUSES)}")
    record = (
        db.query(models.Consultation)
        .filter(models.Consultation.id == consultation_id)
        .first()
    )
    if not record:
        return None
    record.status = status
    db.commit()
    db.refresh(record)
    return record


def delete_consultation(db: Session, consultation_id: int) -> bool:
    """删除咨询记录"""
    c = (
        db.query(models.Consultation)
        .filter(models.Consultation.id == consultation_id)
        .first()
    )
    if not c:
        return False
    db.delete(c)
    db.commit()
    return True