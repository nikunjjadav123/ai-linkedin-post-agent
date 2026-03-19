from typing import TypedDict,Optional

class LinkedInState(TypedDict): 
    topic:str
    linkedin_post:str
    score:int
    status: str
    message: Optional[str]
    linkedin_post_id: Optional[str]