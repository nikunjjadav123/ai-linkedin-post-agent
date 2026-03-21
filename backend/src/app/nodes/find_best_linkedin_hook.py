from app.prompts.find_best_linkedin_hook_prompt import find_best_linkedin_hook_prompt
from app.schemas.state import LinkedInState
from app.services import get_llm
from app.schemas.schema import HooksResponse
from langchain_core.output_parsers import PydanticOutputParser

def find_best_linkedin_hook(state:LinkedInState)-> LinkedInState:

    
    formatted_prompt = find_best_linkedin_hook_prompt.format_messages(hooks= state["hooks"])
    response = get_llm().invoke(formatted_prompt)

    parser = PydanticOutputParser(pydantic_object=HooksResponse)

    parsed = parser.parse(response.content)

    ranked_hooks = parsed.hooks

    best_hook = ranked_hooks[0].hook if ranked_hooks else ""

    return {
        "the_best_hook": best_hook
    }