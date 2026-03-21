from langchain_core.prompts import ChatPromptTemplate

evalute_prompt = ChatPromptTemplate(
        [
            ("system","You are an linkedin quality evaluator."),
            ("human", """
                Score the following LinkedIn post from 1-10 AND give improvement feedback.

                Rules:
                - Return JSON only
                - Format:
                {{
                "score": <number>,
                "feedback": "<what to improve>"
                }}

                Post:
                {linkedin_post}
                """)
        ]
        
    )