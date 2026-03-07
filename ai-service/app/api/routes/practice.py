from fastapi import APIRouter
from app.schemas.request import PracticeRequest
from app.schemas.response import PracticeResponse
from app.services.practice_generator import generate_practice_questions

router = APIRouter()


@router.post("/")
async def generate_practice(payload: PracticeRequest) -> PracticeResponse:

    questions = generate_practice_questions(
        payload.topic,
        payload.difficulty
    )

    return PracticeResponse(
        questions=questions
    )