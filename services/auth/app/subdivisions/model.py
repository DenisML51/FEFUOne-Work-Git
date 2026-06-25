from sqlalchemy import Boolean, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Subdivision(Base):
    __tablename__ = "subdivisions"
    __table_args__ = (UniqueConstraint("title", "parent_id", name="title_parent_id"),)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("subdivisions.id", ondelete="SET NULL"), nullable=True
    )
    level: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, server_default="1", nullable=False
    )
