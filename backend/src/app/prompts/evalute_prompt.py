from langchain_core.prompts import ChatPromptTemplate

evalute_prompt = ChatPromptTemplate(
    [
        ("system", "You are a strict JSON generator and LinkedIn content evaluator."),
        ("human", """
Evaluate the following LinkedIn post.

Instructions:
- Score the post from 1 to 10
- Provide concise improvement feedback

STRICT OUTPUT RULES:
- Return ONLY valid JSON (no explanation, no extra text)
- Use DOUBLE quotes only (")
- Do NOT use single quotes (')
- Do NOT add any text before or after JSON
- Do NOT include newlines inside values
- Ensure JSON is parseable by Python json.loads()

OUTPUT FORMAT:
{{"linkedin_post": "improved post","score": number, "feedback": "string"}}

Post:
{linkedin_post}
""")
    ]
)