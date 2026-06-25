from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.permissions.model import Permission
from app.roles.model import Role
from app.subdivisions.model import Subdivision


class UserHasRole(Base):
    __tablename__ = "user_has_roles"
    __table_args__ = (
        UniqueConstraint(
            "user_id", "role_id", "subdivision_id", name="user_id_role_id_subdivision_id"
        ),
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="CASCADE"), nullable=False
    )
    subdivision_id: Mapped[int | None] = mapped_column(
        ForeignKey("subdivisions.id", ondelete="CASCADE"), nullable=True
    )

    role: Mapped[Role] = relationship(Role, lazy="selectin")
    subdivision: Mapped[Subdivision | None] = relationship(Subdivision, lazy="selectin")


class User(Base):
    __tablename__ = "users"

    email: Mapped[str | None] = mapped_column(String(255), nullable=True, unique=True)
    amelia_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    yandex_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    photo_link: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    avatar_s3_object: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    visited_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, server_default="1", nullable=False
    )

    roles: Mapped[list[UserHasRole]] = relationship(
        UserHasRole,
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )

    @property
    def permissions(self) -> list[Permission]:
        seen: list[Permission] = []
        for config in self.roles:
            if config.role and config.role.permissions:
                for permission in config.role.permissions:
                    if permission not in seen:
                        seen.append(permission)
        return seen
