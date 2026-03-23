from langchain_core.prompts import ChatPromptTemplate

generate_hashtags_prompt = ChatPromptTemplate(
    [
        ("system", "You are a LinkedIn hashtag expert and strict JSON generator."),
        ("human", """
Generate relevant hashtags for the following LinkedIn post.

Instructions:
- Generate 5-10 highly relevant hashtags
- Focus on industry-specific and trending hashtags
- Prioritize hashtags that maximize post visibility
- Avoid generic or overly broad hashtags

STRICT OUTPUT RULES:
- Return ONLY valid JSON (no explanation, no extra text)
- Use DOUBLE quotes only (")
- Do NOT use single quotes (')
- Do NOT add any text before or after JSON
- Do NOT include newlines inside values
- Ensure JSON is parseable by Python json.loads()

OUTPUT FORMAT:
{{"hashtags": ["hashtag1", "hashtag2", "hashtag3"]}}

Post:
{linkedin_post}
""")
    ]
)