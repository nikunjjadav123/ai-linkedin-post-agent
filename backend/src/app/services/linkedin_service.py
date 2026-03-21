from dotenv import load_dotenv
load_dotenv()
import requests
import os


def post_to_linkedin_api(linkedin_post: str):

        url = "https://api.linkedin.com/v2/ugcPosts"

        access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
        person_id = os.getenv("LINKEDIN_PERSON_ID")

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
                    "text": linkedin_post
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
