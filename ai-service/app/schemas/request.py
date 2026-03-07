from pydantic import BaseModel


class ExplainRequest(BaseModel):
    question: str
    level: str = "beginner"


class PracticeRequest(BaseModel):
    topic: str
    difficulty: str = "medium"


class ConceptMapRequest(BaseModel):
    topic: str