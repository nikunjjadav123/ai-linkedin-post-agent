from langchain_core.prompts import ChatPromptTemplate

find_best_linkedin_hook_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a LinkedIn content writer."),
    ("human", """Rank the below hooks for LinkedIn:
{hooks}

Score each hook (1–10) based on:
- Curiosity
- Clarity
- Emotional impact
- Scroll-stopping ability

Return ONLY valid JSON. No explanation. No markdown.

Strictly follow this format:
{{
  "hooks": [
    {{"hook": "...", "score": 0}}
  ]
}}
""")
])