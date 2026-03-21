# src/app/prompts/linkedin_hooks_prompt.py

from langchain_core.prompts import ChatPromptTemplate

linkedin_hooks_prompt = ChatPromptTemplate(
        [
            ("system", "You are a LinkedIn content writer."),
            ("human", """
You are a LinkedIn content expert.

Generate 5 scroll-stopping hooks for the topic: {topic}.

Guidelines:
- Each hook should make the reader pause
- Avoid generic phrases like "In today's world"
- Keep it short and impactful (1–2 lines)
- Make it feel real and relatable
- Prioritize clarity over complexity

Hook styles:
1. Question
2. Bold claim
3. Contrarian take
4. Pain point
5. Unexpected insight

Return only JSON:
{{
    "hooks": ["...", "...", "...", "...", "..."]
}}
""")
        ]
    )