from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid
from typing import Optional

class ColumnCreate(BaseModel):
    title: str

class ColumnUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = None

class ColumnResponse(BaseModel):
    id: uuid.UUID
    board_id: uuid.UUID
    title: str
    position: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
