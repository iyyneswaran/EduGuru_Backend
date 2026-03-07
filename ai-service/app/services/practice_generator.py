from app.core.llm import call_llm


def generate_practice_questions(topic: str, difficulty: str):

    prompt = f"""
Generate 5 {difficulty} level practice questions on {topic}.
Return JSON format:

[
 {{
   "topic": "{topic}",
   "difficulty": "{difficulty}",
   "question": "...",
   "correctAnswer": "..."
 }}
]
"""

    response = call_llm(prompt)

    return response