from app.schemas.state import LinkedInState
from app.services import post_to_linkedin_api
import requests

def post_linkedin_after_approve(state: LinkedInState) -> LinkedInState:

        linkedin_post = state["linkedin_post"]

        result = post_to_linkedin_api(linkedin_post)

        try:

            if result.status_code in [200, 201, 202]:
                data = result.json()
                post_id = data.get("id")

                return {
                    "status": "success",
                    "message": "Post successfully published to LinkedIn",
                    "linkedin_post_id": post_id
                }
            else:
                return {
                    "status": "failed",
                    "message": result.text,
                    "status_code": result.status_code
                }

        except requests.exceptions.Timeout:
            return {
                "status": "failed",
                "message": "Request timed out"
            }

        except requests.exceptions.RequestException as e:
            return {
                "status": "failed",
                "message": str(e)
            }