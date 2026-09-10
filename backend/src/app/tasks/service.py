from sqlalchemy.orm import Session
from src.app.models import Task, Column, Board
from .schemas import TaskCreate, TaskUpdate, TaskMove
from fastapi import HTTPException, status
import uuid

def _get_column_and_verify(db: Session, column_id: uuid.UUID, user_id: uuid.UUID) -> Column:
    column = db.query(Column).filter(Column.id == column_id).first()
    if not column:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
    
    board = db.query(Board).filter(Board.id == column.board_id).first()
    if not board or board.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
        
    return column

def _get_task_and_verify(db: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    _get_column_and_verify(db, task.column_id, user_id)
    return task

def create_task(db: Session, column_id: uuid.UUID, user_id: uuid.UUID, task_create: TaskCreate):
    _get_column_and_verify(db, column_id, user_id)
    max_pos = db.query(Task).filter(Task.column_id == column_id).count()
    
    db_task = Task(
        column_id=column_id,
        title=task_create.title,
        description=task_create.description,
        position=max_pos
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: uuid.UUID, user_id: uuid.UUID, task_update: TaskUpdate):
    task = _get_task_and_verify(db, task_id, user_id)
    
    if task_update.column_id is not None and task_update.column_id != task.column_id:
        _get_column_and_verify(db, task_update.column_id, user_id)
        task.column_id = task_update.column_id
        
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.position is not None:
        task.position = task_update.position
        
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: uuid.UUID, user_id: uuid.UUID):
    task = _get_task_and_verify(db, task_id, user_id)
    db.delete(task)
    db.commit()

def move_task(db: Session, task_id: uuid.UUID, user_id: uuid.UUID, task_move: TaskMove):
    task = _get_task_and_verify(db, task_id, user_id)
    _get_column_and_verify(db, task_move.column_id, user_id)
    
    task.column_id = task_move.column_id
    task.position = task_move.position
    db.commit()
    db.refresh(task)
    return task
