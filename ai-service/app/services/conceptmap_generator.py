from app.core.llm import call_llm


def generate_concept_map(topic: str):

    prompt = f"""
Create a concept map for {topic}.

Return JSON:

{{
 "nodes": [{{"id": "node1", "label": "Concept"}}],
 "edges": [{{"source": "node1", "target": "node2"}}]
}}
"""

    response = call_llm(prompt)

    return response