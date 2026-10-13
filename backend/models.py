from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")

    skills: Mapped[list["Skill"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    columns: Mapped[list["KanbanColumn"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    tasks: Mapped[list["Task"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")

    project: Mapped["Project"] = relationship(back_populates="skills")
    versions: Mapped[list["SkillVersion"]] = relationship(
        back_populates="skill", cascade="all, delete-orphan"
    )


class SkillVersion(Base):
    __tablename__ = "skill_versions"
    __table_args__ = (UniqueConstraint("skill_id", "number"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    number: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text, default="")

    skill: Mapped["Skill"] = relationship(back_populates="versions")
    tasks: Mapped[list["Task"]] = relationship(back_populates="skill_version")


class KanbanColumn(Base):
    __tablename__ = "kanban_columns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String(100))
    position: Mapped[int] = mapped_column(Integer, default=0)

    project: Mapped["Project"] = relationship(back_populates="columns")
    tasks: Mapped[list["Task"]] = relationship(
        back_populates="column", cascade="all, delete-orphan"
    )


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    column_id: Mapped[int] = mapped_column(ForeignKey("kanban_columns.id"))
    skill_version_id: Mapped[int | None] = mapped_column(
        ForeignKey("skill_versions.id"),
        nullable=True,
    )
    title: Mapped[str] = mapped_column(String(200))
    position: Mapped[int] = mapped_column(Integer, default=0)

    project: Mapped["Project"] = relationship(back_populates="tasks")
    column: Mapped["KanbanColumn"] = relationship(back_populates="tasks")
    skill_version: Mapped["SkillVersion | None"] = relationship(back_populates="tasks")