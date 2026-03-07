from app.core.grok import call_grok


async def process_chat(message: str, history: list[dict] | None = None) -> str:
    """Process a chat message using Grok AI with optional conversation history."""

    messages = []

    # Add conversation history for context
    if history:
        for entry in history:
            messages.append({"role": entry.get("role", "user"), "content": entry["content"]})

    # Add current user message
    messages.append({"role": "user", "content": message})

    import openai
    
    try:
        reply = await call_grok(messages)
        return reply if reply is not None else "No content returned."
    except openai.APIError as e:
        return f"API Error: {e.message}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"
