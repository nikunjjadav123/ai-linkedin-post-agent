# src/app/prompts/generate_prompt.py

from langchain_core.prompts import ChatPromptTemplate

generate_prompt = ChatPromptTemplate(
    [
        ("system", "You are a LinkedIn content writer."),
        ("human", "Write a professional LinkedIn post about {topic} in under 1500 characters.")
    ]
)