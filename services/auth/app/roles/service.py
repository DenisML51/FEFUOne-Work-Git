from app.permissions.service import group_permissions
from app.roles.model import Role
from app.roles.schemas import RoleResponse


def project_role(role: Role) -> RoleResponse:
    return RoleResponse(
        id=role.id,
        title=role.title,
        description=role.description,
        show_subdivision_inventory=role.show_subdivision_inventory,
        permission_ids=role.permission_ids,
        permissions=group_permissions(role.permissions),
    )
