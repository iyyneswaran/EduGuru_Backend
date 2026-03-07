from fastapi import APIRouter
from app.schemas.request import ChatRequest
from app.schemas.response import ChatResponse
from app.services.chat_service import process_chat

router = APIRouter()


@router.post("/")
async def chat(payload: ChatRequest) -> ChatResponse:

    history = [msg.model_dump() for msg in payload.history] if payload.history else None

    reply = process_chat(payload.message, history)

    return ChatResponse(reply=reply)
