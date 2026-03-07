from pydantic import BaseModel
from typing import Optional


class ExplainRequest(BaseModel):
    question: str
    level: str = "beginner"


class PracticeRequest(BaseModel):
    topic: str
    difficulty: str = "medium"


class ConceptMapRequest(BaseModel):
    topic: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[list[ChatMessage]] = None