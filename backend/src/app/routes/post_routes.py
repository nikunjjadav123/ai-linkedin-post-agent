from fastapi import APIRouter, HTTPException
from app.nodes import (
    evaluate_linkedin_post,
    post_linkedin_after_approve,
    find_best_linkedin_hook,
    generate_linkedin_post,
    generate_linkedin_hooks,
    generate_hashtags,
)

from app.schemas.schema import (
    HookInput,
    HookScore,
    PostResponseSchema,
    PublishResponse,
    PublishRequest,
    HookRequest,
    HooksResponse,
    HashtagsRequest,
    HashtagsResponse,
)

# -------------------------------
# Router
# -------------------------------
router = APIRouter(prefix="/linkedin", tags=["LinkedIn Automation"])


# -------------------------------
# 1. Generate Hooks
# -------------------------------
@router.post("/hooks", response_model=HooksResponse)
def generate_hooks(data: HookRequest):
    try:
        result = generate_linkedin_hooks({
            "topic": data.topic
        })

        return HooksResponse(
            hooks=result.get("hooks", [])
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hook generation failed: {str(e)}")


# -------------------------------
# 2. Find Best Hook
# -------------------------------
@router.post("/best-hook", response_model=HookScore)
def find_best_hook(data: HooksResponse):
    try:
        result = find_best_linkedin_hook({
            "hooks": data.hooks
        })

        return HookScore(
            hook=result.get("the_best_hook", ""),
            score=result.get("score", 0)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Best hook selection failed: {str(e)}")


# -------------------------------
# 3. Generate LinkedIn Post
# -------------------------------
@router.post("/post/generate", response_model=PostResponseSchema)
def generate_post(data: HookInput):
    try:
        result = generate_linkedin_post({
            "the_best_hook": data.hook
        })

        return PostResponseSchema(
            linkedin_post=result.get("linkedin_post", ""),
            score=result.get("score", 0),
            feedback=None,
            approved=False
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Post generation failed: {str(e)}")


# -------------------------------
# 4. Evaluate Post
# -------------------------------
@router.post("/post/evaluate", response_model=PostResponseSchema)
def evaluate_post(data: PublishRequest):
    try:
        result = evaluate_linkedin_post({
            "linkedin_post": data.linkedin_post
        })

        return PostResponseSchema(
            linkedin_post=result.get("linkedin_post", data.linkedin_post),
            score=result.get("score", 0),
            feedback=result.get("feedback", ""),
            approved=False
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Post evaluation failed: {str(e)}")


# -------------------------------
# 5. Generate Hashtags
# -------------------------------
@router.post("/post/hashtags", response_model=HashtagsResponse)
def get_hashtags(data: HashtagsRequest):
    try:
        result = generate_hashtags({
            "linkedin_post": data.linkedin_post
        })

        return HashtagsResponse(
            hashtags=result.get("hashtags", [])
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hashtag generation failed: {str(e)}")


# -------------------------------
# 6. Publish Post
# -------------------------------
@router.post("/post/publish", response_model=PublishResponse)
def publish_post(data: PublishRequest):
    try:
        result = post_linkedin_after_approve({
            "linkedin_post": data.linkedin_post,
            "hashtags": data.hashtags
        })

        return PublishResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Post publishing failed: {str(e)}")