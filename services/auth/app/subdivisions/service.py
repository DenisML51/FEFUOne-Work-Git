from app.subdivisions.model import Subdivision
from app.subdivisions.schemas import SubdivisionResponse


def project_subdivision(subdivision: Subdivision) -> SubdivisionResponse:
    return SubdivisionResponse(
        id=subdivision.id,
        title=subdivision.title,
        parent_id=subdivision.parent_id,
        level=subdivision.level,
        is_active=subdivision.is_active,
    )
