from fastapi import APIRouter
from app.schemas.request import ExplainRequest
from app.schemas.response import ExplainResponse
from app.services.explanation_engine import generate_explanation

router = APIRouter()


@router.post("/")
async def explain_concept(payload: ExplainRequest) -> ExplainResponse:
    
    explanation = generate_explanation(
        payload.question,
        payload.level
    )

    return ExplainResponse(
        explanation=explanation
    )