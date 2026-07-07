"""Banner 业务逻辑"""
from typing import List, Optional

from sqlalchemy.orm import Session

from backend import models, schemas


def list_banners(db: Session) -> List[models.Banner]:
    """获取所有 Banner，按 sort_order 升序"""
    return (
        db.query(models.Banner)
        .order_by(models.Banner.sort_order.asc(), models.Banner.id.asc())
        .all()
    )


def get_banner(db: Session, banner_id: int) -> Optional[models.Banner]:
    return db.query(models.Banner).filter(models.Banner.id == banner_id).first()


def create_banner(db: Session, data: schemas.BannerCreate) -> models.Banner:
    banner = models.Banner(**data.model_dump())
    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner


def update_banner(
    db: Session, banner_id: int, data: schemas.BannerUpdate
) -> Optional[models.Banner]:
    banner = get_banner(db, banner_id)
    if not banner:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(banner, key, value)
    db.commit()
    db.refresh(banner)
    return banner


def delete_banner(db: Session, banner_id: int) -> bool:
    banner = get_banner(db, banner_id)
    if not banner:
        return False
    db.delete(banner)
    db.commit()
    return True