from app.prompts.generate_prompt import generate_prompt
from app.schemas.state import LinkedInState
from app.services import get_llm

def generate_linkedin_post(state:LinkedInState)-> LinkedInState:

    formatted_prompt = generate_prompt.format_messages(
        the_best_hook=state["the_best_hook"]
    )
    response_linkedin_post = get_llm().invoke(formatted_prompt)
    
    return { 'linkedin_post':response_linkedin_post.content }