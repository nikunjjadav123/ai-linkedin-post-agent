from langchain_core.prompts import ChatPromptTemplate

evalute_prompt = ChatPromptTemplate(
        [
            ("system","You are an linkedin quality evaluator."),
            ("human", """
                Score the following LinkedIn post from 1-10.

                Rules:
                - Return ONLY a number
                - Do NOT add explanation
                - Do NOT add text

                Post:
                {linkedin_post}
                """
            )
        ]
        
    )