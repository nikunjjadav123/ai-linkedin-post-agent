from fastapi import APIRouter, HTTPException, Query
import os
import requests
from pydantic import BaseModel

router = APIRouter(prefix="/auth/linkedin", tags=["LinkedIn Authentication"])

class LinkedInAuthResponse(BaseModel):
    linkedin_token: str
    linkedin_person_id: str

import urllib.parse

@router.get("/url")
def get_linkedin_auth_url():
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI", "https://ai-linkedin-post-agent.vercel.app/auth/callback")
    
    if not client_id:
        raise HTTPException(status_code=500, detail="LINKEDIN_CLIENT_ID not configured")

    # Scopes required for posting (w_member_social) and fetching user URN (profile)
    # Using v2 scopes 'openid profile w_member_social email'
    scope = "w_member_social profile openid"
    
    encoded_redirect_uri = urllib.parse.quote(redirect_uri, safe='')
    
    url = (
        f"https://www.linkedin.com/oauth/v2/authorization?"
        f"response_type=code&"
        f"client_id={client_id}&"
        f"redirect_uri={encoded_redirect_uri}&"
        f"scope={scope.replace(' ', '%20')}"
    )
    
    return {"url": url}

@router.post("/callback", response_model=LinkedInAuthResponse)
def handle_linkedin_callback(code: str = Query(...)):
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI", "https://ai-linkedin-post-agent.vercel.app/auth/callback")
    
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="LinkedIn credentials not configured")

    # 1. Exchange 'code' for Access Token
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret,
    }
    
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    token_response = requests.post(token_url, data=data, headers=headers)
    
    if token_response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to fetch access token: {token_response.text}")
        
    token_data = token_response.json()
    access_token = token_data.get("access_token")
    
    if not access_token:
        raise HTTPException(status_code=400, detail="No access token returned from LinkedIn")

    # 2. Get the User's Person URN (Sub/ID)
    # Using the userinfo endpoint for OIDC (openid, profile)
    userinfo_url = "https://api.linkedin.com/v2/userinfo"
    userinfo_headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    userinfo_response = requests.get(userinfo_url, headers=userinfo_headers)
    
    if userinfo_response.status_code != 200:
        # Fallback to older /me endpoint if userinfo fails
        fallback_url = "https://api.linkedin.com/v2/me"
        fallback_response = requests.get(fallback_url, headers=userinfo_headers)
        if fallback_response.status_code != 200:
             raise HTTPException(status_code=400, detail=f"Failed to fetch user info: {fallback_response.text}")
        user_data = fallback_response.json()
        person_id = user_data.get("id")
    else:
        user_data = userinfo_response.json()
        # the URN ID from /userinfo is actually in the 'sub' field
        person_id = user_data.get("sub")

    if not person_id:
        raise HTTPException(status_code=400, detail="Failed to parse user associated person ID")

    return LinkedInAuthResponse(
        linkedin_token=access_token,
        linkedin_person_id=person_id
    )
