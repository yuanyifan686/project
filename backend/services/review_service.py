"""用户评价业务逻辑"""
from typing import List, Optional

from sqlalchemy.orm import Session

from backend import models, schemas


def list_reviews(db: Session, limit: int = 10) -> List[models.Review]:
    """获取评价列表"""
    return (
        db.query(models.Review)
        .order_by(models.Review.id.desc())
        .limit(limit)
        .all()
    )


def get_review(db: Session, review_id: int) -> Optional[models.Review]:
    return db.query(models.Review).filter(models.Review.id == review_id).first()


def create_review(db: Session, data: schemas.ReviewCreate) -> models.Review:
    review = models.Review(**data.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def update_review(
    db: Session, review_id: int, data: schemas.ReviewUpdate
) -> Optional[models.Review]:
    review = get_review(db, review_id)
    if not review:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(review, key, value)
    db.commit()
    db.refresh(review)
    return review


def delete_review(db: Session, review_id: int) -> bool:
    review = get_review(db, review_id)
    if not review:
        return False
    db.delete(review)
    db.commit()
    return True