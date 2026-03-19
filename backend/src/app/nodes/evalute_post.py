from langchain_core.prompts import ChatPromptTemplate
from app.prompts.evalute_prompt import evalute_prompt
from app.schemas.state import LinkedInState
from app.services import get_llm

def evaluate_linkedin_post(state:LinkedInState)-> LinkedInState:

    
    formatted_prompt = evalute_prompt.format_messages(
        linkedin_post=state["linkedin_post"]
    )
    score = get_llm().invoke(formatted_prompt)
    final_score = int(score.content.strip())

    return { **state,'score':final_score }