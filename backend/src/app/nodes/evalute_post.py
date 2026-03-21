from app.prompts.evalute_prompt import evalute_prompt
from app.schemas.state import LinkedInState
from app.services import get_llm
import json

def evaluate_linkedin_post(state:LinkedInState)-> LinkedInState:

    
    formatted_prompt = evalute_prompt.format_messages(
        linkedin_post= state["linkedin_post"]
    )
    response = get_llm().invoke(formatted_prompt)
    parsed = json.loads(response.content)

    return { 'score':parsed["score"] , 'feedback':parsed["feedback"] }