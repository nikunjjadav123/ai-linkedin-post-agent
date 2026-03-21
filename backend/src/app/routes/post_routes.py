from fastapi import APIRouter
from app.workflows.linkedin_workflow import app_graph
from app.nodes import post_linkedin_after_approve
from app.schemas.schema import PostResponseSchema,PublishResponse,PublishRequest,PostRequestSchema

generate_router = APIRouter(
    prefix="/post",
    tags=["Content Generation"]
)

publish_router = APIRouter(
    prefix="/publish",
    tags=["Content Publishing"]
)


@generate_router.post("/generate")
def generate_post(data: PostRequestSchema):
    
    result = app_graph().invoke({
        "topic": data.topic
    })

    return PostResponseSchema(
        linkedin_post=result["linkedin_post"],
        score=result["score"],
        approved=False
    )


@publish_router.post("/",response_model=PublishResponse)
def publish_post(data: PublishRequest):
    
    result = post_linkedin_after_approve({
        "linkedin_post": data.linkedin_post
    })
    
    return PublishResponse(
        **result
    )
