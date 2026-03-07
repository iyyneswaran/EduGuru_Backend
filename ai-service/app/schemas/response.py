from pydantic import BaseModel
from typing import List, Dict


class ExplainResponse(BaseModel):
    explanation: str


class PracticeResponse(BaseModel):
    questions: List[Dict]


class ConceptMapResponse(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]