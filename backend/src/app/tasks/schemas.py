from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: str = ""

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    column_id: Optional[uuid.UUID] = None
    position: Optional[int] = None

class TaskMove(BaseModel):
    column_id: uuid.UUID
    position: int

class TaskResponse(BaseModel):
    id: uuid.UUID
    column_id: uuid.UUID
    title: str
    description: str
    position: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
