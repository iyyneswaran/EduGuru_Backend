import asyncio
from app.schemas.request import ChatRequest, ChatMessage
from app.api.routes.chat import chat

async def test():
    payload = ChatRequest(
        message="Bro enaku doubts iruku",
        history=[
            ChatMessage(role="user", content="Help me with algebra quadratic formulas"),
            ChatMessage(role="assistant", content="### What Is a Quadratic Equation?"),
        ]
    )
    try:
        response = await chat(payload)
        print("Success:", response)
    except Exception as e:
        print("Error!")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
