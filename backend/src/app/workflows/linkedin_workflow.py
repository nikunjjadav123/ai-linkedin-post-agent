from app.schemas.state import LinkedInState
from langgraph.graph import StateGraph,START,END
from app.nodes import generate_linkedin_post
from app.nodes import evaluate_linkedin_post
from app.nodes import generate_linkedin_hooks
from app.nodes import find_best_linkedin_hook
from app.nodes import post_linkedin_after_approve
from app.workflows.decision import decide_approve_improve

def app_graph():

    graph = StateGraph(LinkedInState)

    graph.add_node("Generate Hooks Based On Topic",generate_linkedin_hooks)
    graph.add_node("Find Best Hook Based On Score",find_best_linkedin_hook)
    graph.add_node("Generate LinkedIn Post Based on Best Hook",generate_linkedin_post)
    graph.add_node("Evaluate LinkedIn Post",evaluate_linkedin_post)
    graph.add_node("Post LinkedIn After Approve",post_linkedin_after_approve)

    graph.add_edge(START,"Generate Hooks Based On Topic")
    graph.add_edge("Generate Hooks Based On Topic","Find Best Hook Based On Score")
    graph.add_edge("Find Best Hook Based On Score","Generate LinkedIn Post Based on Best Hook")
    graph.add_edge("Generate LinkedIn Post Based on Best Hook","Evaluate LinkedIn Post")
    graph.add_conditional_edges("Evaluate LinkedIn Post",decide_approve_improve,{"approve": END,"need_improvement":"Generate LinkedIn Post Based on Best Hook"})

    workflow = graph.compile()

    return workflow