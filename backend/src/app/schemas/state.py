from typing import TypedDict,Optional,List

class LinkedInState(TypedDict):
    topic:str
    hooks: List[dict]
    the_best_hook:str
    linkedin_post:str
    score:int
    status: str
    message: Optional[str]
    linkedin_post_id: Optional[str]
    feedback: str
    hashtags: Optional[List[str]]
    linkedin_token: Optional[str]
    linkedin_person_id: Optional[str]