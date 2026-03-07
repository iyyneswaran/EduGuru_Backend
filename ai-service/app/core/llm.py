import openai
from app.core.config import OPENAI_API_KEY, MODEL

openai.api_key = OPENAI_API_KEY


def call_llm(prompt: str):

    response = openai.ChatCompletion.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an educational AI tutor."},
            {"role": "user", "content": prompt}
        ]
    )

    return response["choices"][0]["message"]["content"]