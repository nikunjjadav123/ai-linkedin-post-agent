from app.schemas.state import LinkedInState
from langgraph.graph import StateGraph,START,END
from app.nodes import generate_linkedin_post
from app.nodes import evaluate_linkedin_post
from app.nodes import linkedin_post_api
from app.workflows.decision import decide_approve_improve

def app_graph():

    graph = StateGraph(LinkedInState)

    graph.add_node("Generate LinkedIn Post",generate_linkedin_post)
    graph.add_node("Evaluate LinkedIn Post",evaluate_linkedin_post)
    graph.add_node("Post LinkedIn After Approve",linkedin_post_api)

    graph.add_edge(START,"Generate LinkedIn Post")
    graph.add_edge("Generate LinkedIn Post","Evaluate LinkedIn Post")
    
    graph.add_conditional_edges("Evaluate LinkedIn Post",decide_approve_improve,{"approve":END,"need_improvement":"Generate LinkedIn Post"})
    graph.add_edge("Post LinkedIn After Approve",END)

    workflow = graph.compile()

    return workflow