from app.schemas.state import LinkedInState

def decide_approve_improve(state:LinkedInState):

    score = state['score']

    if score >= 0:
        return "approve"
    else:
        return "need_improvement"