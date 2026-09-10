from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.app.database import get_db
from src.app.models import User
from src.app.auth.dependencies import get_current_user
from . import schemas, service
import uuid

router = APIRouter(prefix="/api", tags=["Columns"])

@router.post("/boards/{board_id}/columns", response_model=schemas.ColumnResponse)
def create_column(board_id: uuid.UUID, column: schemas.ColumnCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.create_column(db, board_id, current_user.id, column)

@router.put("/columns/{column_id}", response_model=schemas.ColumnResponse)
def update_column(column_id: uuid.UUID, column: schemas.ColumnUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.update_column(db, column_id, current_user.id, column)

@router.delete("/columns/{column_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_column(column_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service.delete_column(db, column_id, current_user.id)
