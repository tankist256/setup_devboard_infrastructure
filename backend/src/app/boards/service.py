from sqlalchemy.orm import Session
from src.app.models import Board, Column, User
from .schemas import BoardCreate, BoardUpdate
from fastapi import HTTPException, status
import uuid

def get_user_boards(db: Session, user_id: uuid.UUID):
    return db.query(Board).filter(Board.owner_id == user_id).all()

def get_board_detail(db: Session, board_id: uuid.UUID, user_id: uuid.UUID):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board or board.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    return board

def create_board(db: Session, user_id: uuid.UUID, board_create: BoardCreate):
    db_board = Board(title=board_create.title, owner_id=user_id)
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    
    # Create default columns
    default_columns = ["To Do", "In Progress", "Done"]
    for idx, title in enumerate(default_columns):
        db_col = Column(board_id=db_board.id, title=title, position=idx)
        db.add(db_col)
    
    db.commit()
    db.refresh(db_board)
    return db_board

def update_board(db: Session, board_id: uuid.UUID, user_id: uuid.UUID, board_update: BoardUpdate):
    board = get_board_detail(db, board_id, user_id)
    board.title = board_update.title
    db.commit()
    db.refresh(board)
    return board

def delete_board(db: Session, board_id: uuid.UUID, user_id: uuid.UUID):
    board = get_board_detail(db, board_id, user_id)
    db.delete(board)
    db.commit()
