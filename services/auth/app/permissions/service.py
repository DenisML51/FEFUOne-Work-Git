from collections.abc import Iterable

from app.permissions.model import Permission


def group_permissions(permissions: Iterable[Permission]) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = {}
    for permission in permissions:
        grouped.setdefault(permission.entity, []).append(permission.title)
    return grouped
