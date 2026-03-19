from dotenv import load_dotenv
load_dotenv()
from langchain_groq import ChatGroq
import os

def get_llm():
    
    llm = ChatGroq(model=os.getenv("GROQ_LLM_MODEL"),api_key=os.getenv("GROQ_API_KEY"))

    return llm