import traceback
from fastapi import APIRouter
from app.schemas.request import ChatRequest
from app.schemas.response import ChatResponse
from app.services.chat_service import process_chat

router = APIRouter()


@router.post("/")
async def chat(payload: ChatRequest) -> ChatResponse:
    try:
        history = [msg.model_dump() for msg in payload.history] if payload.history else None

        # We await the process_chat function so it doesn't block FastAPI's event loop
        reply = await process_chat(payload.message, history)

        return ChatResponse(reply=reply)
    except Exception as e:
        print(f"[CHAT ROUTE ERROR] {type(e).__name__}: {e}")
        traceback.print_exc()
        return ChatResponse(reply="Sorry, I encountered an error. Please try again later.")
