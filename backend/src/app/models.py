import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, ForeignKey, Integer, DateTime, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    boards: Mapped[List["Board"]] = relationship("Board", back_populates="owner", cascade="all, delete-orphan")

class Board(Base):
    __tablename__ = "boards"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner: Mapped["User"] = relationship("User", back_populates="boards")
    columns: Mapped[List["Column"]] = relationship("Column", back_populates="board", cascade="all, delete-orphan", order_by="Column.position")

class Column(Base):
    __tablename__ = "columns"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    board_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("boards.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String)
    position: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    board: Mapped["Board"] = relationship("Board", back_populates="columns")
    tasks: Mapped[List["Task"]] = relationship("Task", back_populates="column", cascade="all, delete-orphan", order_by="Task.position")

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    column_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("columns.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String, default="")
    position: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    column: Mapped["Column"] = relationship("Column", back_populates="tasks")
