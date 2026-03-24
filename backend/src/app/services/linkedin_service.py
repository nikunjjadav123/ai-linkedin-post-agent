from dotenv import load_dotenv
load_dotenv()
import requests
import os
from typing import List, Optional


def post_to_linkedin_api(linkedin_post: str, access_token: str, person_id: str, hashtags: Optional[List[str]] = None):

        url = "https://api.linkedin.com/v2/ugcPosts"

        if not access_token or not person_id:
            raise ValueError("LinkedIn credentials (access_token, person_id) must be provided.")


        # Append hashtags to post if provided
        post_content = linkedin_post
        if hashtags:
            hashtag_text = " ".join(tag if tag.startswith("#") else f"#{tag}" for tag in hashtags)
            post_content = f"{linkedin_post}\n\n{hashtag_text}"

        headers = {
            "Authorization": f"Bearer {access_token}",
            "LinkedIn-Version": "202307",
            "Content-Type": "application/json"
        }

        payload = {
        "author": f"urn:li:person:{person_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": post_content
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }
        response = requests.post(url, headers=headers, json=payload, timeout=10)

        return response
