from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""


class ProjectUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""


class ProjectRead(BaseModel):
    id: int
    name: str
    description: str

    model_config = {"from_attributes": True}

class SkillCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""
    content: str = ""


class SkillRead(BaseModel):
    id: int
    project_id: int
    name: str
    description: str

    model_config = {"from_attributes": True}


class SkillVersionRead(BaseModel):
    id: int
    skill_id: int
    number: int
    content: str

    model_config = {"from_attributes": True}