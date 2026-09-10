from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.app.database import get_db
from src.app.models import User
from src.app.auth.dependencies import get_current_user
from . import schemas, service
from typing import List
import uuid

router = APIRouter(prefix="/api/boards", tags=["Boards"])

@router.get("/", response_model=List[schemas.BoardResponse])
def read_boards(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_user_boards(db, current_user.id)

@router.post("/", response_model=schemas.BoardResponse)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.create_board(db, current_user.id, board)

@router.get("/{board_id}", response_model=schemas.BoardDetailResponse)
def read_board(board_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_board_detail(db, board_id, current_user.id)

@router.put("/{board_id}", response_model=schemas.BoardResponse)
def update_board(board_id: uuid.UUID, board: schemas.BoardUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.update_board(db, board_id, current_user.id, board)

@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_board(board_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service.delete_board(db, board_id, current_user.id)
