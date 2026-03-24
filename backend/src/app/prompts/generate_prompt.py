# src/app/prompts/generate_prompt.py

from langchain_core.prompts import ChatPromptTemplate

generate_prompt = ChatPromptTemplate(
    [
        ("system", "You are an expert LinkedIn copywriter and content strategist."),
        ("human", """
        Write a high-quality, fully optimized LinkedIn post using the hook below:

        Hook: {the_best_hook}

        CRITICAL FORMATTING INSTRUCTIONS:
        - Start with the exact hook given (unchanged).
        - Explain the core idea concisely in a short paragraph after the hook.
        - Include 3–5 key insights or actionable points.
        - **Use proper formatting**: use bullet points (• or -) or numbered/ordered lists for the key insights.
        - **Maintain clean spacing**: use clear empty lines between every paragraph or list item to ensure maximum readability.
        - Avoid raw or unstructured giant text blocks. The post must be easy to skim.
        - Ensure the final output is ready to be pasted directly into LinkedIn with correct indentation and structure.
        - End with a strong, single-sentence takeaway or a clear call-to-action (CTA) posing a question to drive engagement.

        Tone: Professional, engaging, relatable, and thought-provoking.
        Length: Medium (not too long, concise, impactful).
        
        Return ONLY the finalized post text. Do not include introductory or concluding remarks (like "Here is the post:").
        """)
    ]
)