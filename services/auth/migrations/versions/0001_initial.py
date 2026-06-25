"""initial auth schema + seed

Revision ID: 0001
Revises:
Create Date: 2026-06-22

"""
from typing import Sequence, Union

import bcrypt
import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def upgrade() -> None:
    op.create_table(
        "subdivisions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False, unique=True),
    )

    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False, unique=True),
        sa.Column("description", sa.String(512), nullable=True),
    )

    op.create_table(
        "permissions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("entity", sa.String(64), nullable=False),
        sa.Column("action", sa.String(64), nullable=False),
        sa.UniqueConstraint("entity", "action", name="uq_permission"),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=True),
        sa.Column("photo_link", sa.String(1024), nullable=True),
        sa.Column("yandex_id", sa.String(64), nullable=True, unique=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("visited_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "role_permissions",
        sa.Column(
            "role_id",
            sa.Integer(),
            sa.ForeignKey("roles.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "permission_id",
            sa.Integer(),
            sa.ForeignKey("permissions.id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )

    op.create_table(
        "user_roles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "role_id", sa.Integer(), sa.ForeignKey("roles.id"), nullable=False
        ),
        sa.Column(
            "subdivision_id",
            sa.Integer(),
            sa.ForeignKey("subdivisions.id"),
            nullable=True,
        ),
        sa.UniqueConstraint(
            "user_id", "role_id", "subdivision_id", name="uq_user_role"
        ),
    )
    op.create_index("ix_user_roles_user_id", "user_roles", ["user_id"])

    # --- seed -----------------------------------------------------------------
    subdivisions = sa.table(
        "subdivisions", sa.column("id", sa.Integer), sa.column("title", sa.String)
    )
    roles = sa.table(
        "roles",
        sa.column("id", sa.Integer),
        sa.column("title", sa.String),
        sa.column("description", sa.String),
    )
    permissions = sa.table(
        "permissions",
        sa.column("id", sa.Integer),
        sa.column("entity", sa.String),
        sa.column("action", sa.String),
    )
    role_permissions = sa.table(
        "role_permissions",
        sa.column("role_id", sa.Integer),
        sa.column("permission_id", sa.Integer),
    )
    users = sa.table(
        "users",
        sa.column("id", sa.Integer),
        sa.column("email", sa.String),
        sa.column("full_name", sa.String),
        sa.column("password_hash", sa.String),
    )
    user_roles = sa.table(
        "user_roles",
        sa.column("id", sa.Integer),
        sa.column("user_id", sa.Integer),
        sa.column("role_id", sa.Integer),
        sa.column("subdivision_id", sa.Integer),
    )

    op.bulk_insert(
        subdivisions,
        [{"id": 1, "title": "Управление имущественных отношений"}],
    )
    op.bulk_insert(
        roles,
        [
            {
                "id": 1,
                "title": "Материально ответственное лицо",
                "description": "Учёт и движение товарно-материальных ценностей",
            }
        ],
    )
    op.bulk_insert(
        permissions,
        [
            {"id": 1, "entity": "inventory", "action": "read"},
            {"id": 2, "entity": "inventory", "action": "write"},
            {"id": 3, "entity": "act", "action": "read"},
            {"id": 4, "entity": "act", "action": "write"},
        ],
    )
    op.bulk_insert(
        role_permissions,
        [
            {"role_id": 1, "permission_id": 1},
            {"role_id": 1, "permission_id": 2},
            {"role_id": 1, "permission_id": 3},
            {"role_id": 1, "permission_id": 4},
        ],
    )
    op.bulk_insert(
        users,
        [
            {
                "id": 1,
                "email": "mol@dvfu.ru",
                "full_name": "Русинов Денис Сергеевич",
                "password_hash": _hash("mol12345"),
            },
            {
                "id": 2,
                "email": "den.rusinov@dvfu.ru",
                "full_name": "Русинов Денис Сергеевич",
                "password_hash": _hash("mol12345"),
            },
        ],
    )
    op.bulk_insert(
        user_roles,
        [
            {"id": 1, "user_id": 1, "role_id": 1, "subdivision_id": 1},
            {"id": 2, "user_id": 2, "role_id": 1, "subdivision_id": 1},
        ],
    )

    # Align serial sequences with the explicitly inserted ids.
    for table in ("subdivisions", "roles", "permissions", "users", "user_roles"):
        op.execute(
            f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), "
            f"(SELECT MAX(id) FROM {table}))"
        )


def downgrade() -> None:
    op.drop_table("user_roles")
    op.drop_table("role_permissions")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    op.drop_table("permissions")
    op.drop_table("roles")
    op.drop_table("subdivisions")
