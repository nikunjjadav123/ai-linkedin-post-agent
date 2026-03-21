from app.schemas.state import LinkedInState
from app.schemas.schema import HooksResponse
from langchain_core.output_parsers import PydanticOutputParser


def find_best_linkedin_hook(state: LinkedInState) -> LinkedInState:

    hooks = state.get("hooks", [])

    if not hooks:
        return {
            "the_best_hook": "",
            "score": 0
        }

    best_hook_obj = max(
        hooks,
        key=lambda x: (x.score, len(x.hook))
    )

    return {
        "the_best_hook": best_hook_obj.hook,
        "score": best_hook_obj.score
    }