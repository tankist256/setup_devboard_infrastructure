from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.app.database import get_db
from src.app.models import User
from src.app.auth.dependencies import get_current_user
from . import schemas, service
import uuid

router = APIRouter(prefix="/api", tags=["Tasks"])

@router.post("/columns/{column_id}/tasks", response_model=schemas.TaskResponse)
def create_task(column_id: uuid.UUID, task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.create_task(db, column_id, current_user.id, task)

@router.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: uuid.UUID, task: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.update_task(db, task_id, current_user.id, task)

@router.patch("/tasks/{task_id}/move", response_model=schemas.TaskResponse)
def move_task(task_id: uuid.UUID, task_move: schemas.TaskMove, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.move_task(db, task_id, current_user.id, task_move)

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service.delete_task(db, task_id, current_user.id)
