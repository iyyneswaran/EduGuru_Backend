from app.utils.prompt_builder import build_explanation_prompt
from app.core.llm import call_llm


def generate_explanation(question: str, level: str):

    prompt = build_explanation_prompt(question, level)

    response = call_llm(prompt)

    return response