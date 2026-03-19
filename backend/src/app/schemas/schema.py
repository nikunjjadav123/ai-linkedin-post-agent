from pydantic import BaseModel,Field
from typing import Optional

class PostRequestSchema(BaseModel):
    topic: str

class PostResponseSchema(BaseModel):
    linkedin_post: str
    score: int
    approved: bool = False

class PublishRequest(BaseModel):
    linkedin_post: str = Field(
        description="Generated LinkedIn post content to publish"
    )

class PublishResponse(BaseModel):
    status: str
    message: str
    linkedin_post_id: Optional[str] = None
    status_code: Optional[int] = None