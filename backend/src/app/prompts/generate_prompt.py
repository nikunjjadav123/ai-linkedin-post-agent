# src/app/prompts/generate_prompt.py

from langchain_core.prompts import ChatPromptTemplate

generate_prompt = ChatPromptTemplate(
        [
           ("system","You are a LinkedIn content writer."),
            ("human", """
            Write a high-quality LinkedIn post using the hook below:

            Hook: {the_best_hook}

            Guidelines:
            - Start with the hook (unchanged)
            - Explain the idea clearly
            - Add 3–5 key insights or points
            - Keep it engaging and easy to read
            - Use short paragraphs
            - End with a strong takeaway or call-to-action

            Tone: Professional, relatable, and thought-provoking
            Length: Medium (not too long, not too short)
            """)     
                    ]
                
                )