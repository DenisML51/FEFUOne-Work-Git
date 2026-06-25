from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.roles.model import role_has_permissions


class Permission(Base):
    __tablename__ = "permissions"
    __table_args__ = (UniqueConstraint("title", "entity", name="title_entity"),)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    entity: Mapped[str] = mapped_column(String(30), nullable=False)

    roles: Mapped[list["Role"]] = relationship(
        "Role",
        secondary=role_has_permissions,
        back_populates="permissions",
        passive_deletes=True,
    )

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Permission):
            return (
                self.title.lower() == other.title.lower()
                and self.entity.lower() == other.entity.lower()
            )
        return NotImplemented

    def __hash__(self) -> int:
        return hash((self.title.lower(), self.entity.lower()))
