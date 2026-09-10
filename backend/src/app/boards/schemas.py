from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid
from typing import List

class TaskResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    position: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ColumnWithTasks(BaseModel):
    id: uuid.UUID
    title: str
    position: int
    tasks: List[TaskResponse] = []
    model_config = ConfigDict(from_attributes=True)

class BoardCreate(BaseModel):
    title: str

class BoardUpdate(BaseModel):
    title: str

class BoardResponse(BaseModel):
    id: uuid.UUID
    title: str
    owner_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BoardDetailResponse(BaseModel):
    id: uuid.UUID
    title: str
    owner_id: uuid.UUID
    created_at: datetime
    columns: List[ColumnWithTasks] = []
    model_config = ConfigDict(from_attributes=True)
