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


class SkillVersionCreate(BaseModel):
    content: str = Field(min_length=1)


class SkillVersionRead(BaseModel):
    id: int
    skill_id: int
    number: int
    content: str

    model_config = {"from_attributes": True}


class VersionOptionRead(BaseModel):
    id: int
    skill_id: int
    skill_name: str
    number: int


class ColumnRead(BaseModel):
    id: int
    project_id: int
    name: str
    position: int

    model_config = {"from_attributes": True}


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    skill_version_id: int | None = None


class TaskMove(BaseModel):
    column_id: int


class TaskRead(BaseModel):
    id: int
    project_id: int
    column_id: int
    skill_version_id: int | None
    title: str
    position: int

    model_config = {"from_attributes": True}