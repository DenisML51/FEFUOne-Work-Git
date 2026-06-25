"""Auth schema (normalised to 3NF).

    users ──< user_roles >── roles ──< role_permissions >── permissions
                   │
                   └────────── subdivisions

Every non-key column depends on the whole primary key and nothing else:
- ``users`` keeps only identity/profile attributes (email is a candidate key);
- ``roles`` / ``subdivisions`` / ``permissions`` are reference tables;
- ``user_roles`` is the role assignment (a user holds a role within a
  subdivision) — the surrogate ``id`` is the reference's ``config_id``;
- ``role_permissions`` is the pure many-to-many bridge.
"""

from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str | None] = mapped_column(String(255))
    photo_link: Mapped[str | None] = mapped_column(String(1024))
    yandex_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    phone: Mapped[str | None] = mapped_column(String(32))
    visited_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    roles: Mapped[list["UserRole"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Subdivision(Base):
    __tablename__ = "subdivisions"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), unique=True)


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), unique=True)
    description: Mapped[str | None] = mapped_column(String(512))

    permissions: Mapped[list["Permission"]] = relationship(
        secondary="role_permissions", lazy="selectin"
    )


class Permission(Base):
    __tablename__ = "permissions"
    __table_args__ = (UniqueConstraint("entity", "action", name="uq_permission"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    entity: Mapped[str] = mapped_column(String(64))
    action: Mapped[str] = mapped_column(String(64))


class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True
    )
    permission_id: Mapped[int] = mapped_column(
        ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True
    )


class UserRole(Base):
    """Role assignment — the reference's ``config_id`` is this row's id."""

    __tablename__ = "user_roles"
    __table_args__ = (
        UniqueConstraint("user_id", "role_id", "subdivision_id", name="uq_user_role"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))
    subdivision_id: Mapped[int | None] = mapped_column(ForeignKey("subdivisions.id"))

    user: Mapped["User"] = relationship(back_populates="roles")
    role: Mapped["Role"] = relationship(lazy="selectin")
    subdivision: Mapped["Subdivision | None"] = relationship(lazy="selectin")
