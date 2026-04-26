from pydantic import BaseModel
class User(BaseModel):
    email: str
    password: str

class GoogleUser(BaseModel):
    email: str
    name: str

class ResumeInput(BaseModel):
    text: str