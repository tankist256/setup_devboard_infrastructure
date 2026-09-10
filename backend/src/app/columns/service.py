from sqlalchemy.orm import Session
from src.app.models import Column, Board
from .schemas import ColumnCreate, ColumnUpdate
from fastapi import HTTPException, status
import uuid

def _verify_board_ownership(db: Session, board_id: uuid.UUID, user_id: uuid.UUID):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board or board.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    return board

def _get_column(db: Session, column_id: uuid.UUID, user_id: uuid.UUID):
    column = db.query(Column).filter(Column.id == column_id).first()
    if not column:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
    _verify_board_ownership(db, column.board_id, user_id)
    return column

def create_column(db: Session, board_id: uuid.UUID, user_id: uuid.UUID, column_create: ColumnCreate):
    _verify_board_ownership(db, board_id, user_id)
    # Determine next position
    max_pos = db.query(Column).filter(Column.board_id == board_id).count()
    
    db_col = Column(board_id=board_id, title=column_create.title, position=max_pos)
    db.add(db_col)
    db.commit()
    db.refresh(db_col)
    return db_col

def update_column(db: Session, column_id: uuid.UUID, user_id: uuid.UUID, column_update: ColumnUpdate):
    column = _get_column(db, column_id, user_id)
    
    if column_update.title is not None:
        column.title = column_update.title
    if column_update.position is not None:
        column.position = column_update.position
        
    db.commit()
    db.refresh(column)
    return column

def delete_column(db: Session, column_id: uuid.UUID, user_id: uuid.UUID):
    column = _get_column(db, column_id, user_id)
    db.delete(column)
    db.commit()
