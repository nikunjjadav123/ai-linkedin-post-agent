from pydantic import BaseModel, Field
from typing import Optional, List


# -------------------------------
# Base Config (Optional but Pro)
# -------------------------------
class BaseSchema(BaseModel):
    class Config:
        populate_by_name = True
        str_strip_whitespace = True


# -------------------------------
# Post Generation Schemas
# -------------------------------
class PostRequestSchema(BaseSchema):
    topic: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Topic for generating LinkedIn post"
    )


class PostResponseSchema(BaseSchema):
    linkedin_post: str = Field(
        ...,
        description="Generated or improved LinkedIn post content"
    )
    score: Optional[int] = Field(
        default=0,
        ge=0,
        le=10,
        description="Quality score of the post (0-10)"
    )
    feedback: Optional[str] = Field(
        default=None,
        description="Improvement feedback for the post"
    )
    approved: bool = Field(
        default=False,
        description="Indicates whether the post is approved for publishing"
    )


# -------------------------------
# Publishing Schemas
# -------------------------------
class PublishRequest(BaseSchema):
    linkedin_post: str = Field(
        ...,
        min_length=10,
        description="Final LinkedIn post content to publish"
    )


class PublishResponse(BaseSchema):
    status: str = Field(
        ...,
        description="Publishing status (success/failure)"
    )
    message: str = Field(
        ...,
        description="Detailed response message"
    )
    linkedin_post_id: Optional[str] = Field(
        default=None,
        description="Unique ID of the published LinkedIn post"
    )
    status_code: Optional[int] = Field(
        default=None,
        description="HTTP or internal status code"
    )


# -------------------------------
# Hooks Schemas
# -------------------------------
class HookRequest(BaseSchema):
    topic: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Topic to generate LinkedIn hooks"
    )


class HookScore(BaseSchema):
    hook: str = Field(
        ...,
        min_length=5,
        description="Generated hook text"
    )
    score: int = Field(
        ...,
        ge=0,
        le=10,
        description="Hook quality score (0-10)"
    )


class HooksResponse(BaseSchema):
    hooks: List[HookScore] = Field(
        ...,
        description="List of generated hooks with scores"
    )


class HookInput(BaseSchema):
    hook: str = Field(
        ...,
        min_length=5,
        description="Selected hook for post generation"
    )