from fastapi import APIRouter
from app.schemas.request import ConceptMapRequest
from app.schemas.response import ConceptMapResponse
from app.services.conceptmap_generator import generate_concept_map

router = APIRouter()


@router.post("/")
async def concept_map(payload: ConceptMapRequest) -> ConceptMapResponse:

    graph = generate_concept_map(payload.topic)

    return ConceptMapResponse(
        nodes=graph["nodes"],
        edges=graph["edges"]
    )