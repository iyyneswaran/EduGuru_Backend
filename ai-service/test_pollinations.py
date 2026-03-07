import os
from openai import OpenAI

client = OpenAI(
    api_key="sk_2SXECYmB9EcybbTymCZSJ7rsZYBUqPKV",
    base_url="https://text.pollinations.ai/openai"
)

try:
    response = client.chat.completions.create(
        model="openai",
        messages=[{"role": "user", "content": "Hello! What is your name?"}],
    )
    print("SUCCESS!")
    print(response.choices[0].message.content)
except Exception as e:
    print("ERROR:", str(e))
