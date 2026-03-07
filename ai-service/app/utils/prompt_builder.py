def build_explanation_prompt(question: str, level: str):

    return f"""
Explain the following concept clearly.

Question:
{question}

Explanation level:
{level}

Give examples and keep it simple.
"""