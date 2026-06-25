from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

role_has_permissions = Table(
    "role_has_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False),
    Column(
        "permission_id",
        Integer,
        ForeignKey("permissions.id", ondelete="CASCADE"),
        nullable=False,
    ),
    UniqueConstraint("role_id", "permission_id", name="role_id_permission_id"),
)


class Role(Base):
    __tablename__ = "roles"

    title: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    show_subdivision_inventory: Mapped[bool] = mapped_column(
        Boolean, default=True, server_default="1", nullable=False
    )

    permissions: Mapped[list["Permission"]] = relationship(
        "Permission",
        secondary=role_has_permissions,
        back_populates="roles",
        lazy="selectin",
        passive_deletes=True,
    )

    @property
    def permission_ids(self) -> list[int]:
        return [permission.id for permission in self.permissions]
