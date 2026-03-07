from fastapi import FastAPI
from app.api.routes import explain, practice, conceptmap, chat

app = FastAPI(
    title="EduGuru AI Service",
    description="AI microservice for explanations, practice generation, and concept maps",
    version="1.0.0"
)

app.include_router(explain.router, prefix="/explain", tags=["Explain"])
app.include_router(practice.router, prefix="/practice", tags=["Practice"])
app.include_router(conceptmap.router, prefix="/conceptmap", tags=["ConceptMap"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])


@app.get("/")
def health():
    return {"status": "AI service running"}