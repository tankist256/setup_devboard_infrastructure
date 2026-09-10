from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .auth.router import router as auth_router
from .boards.router import router as boards_router
from .columns.router import router as columns_router
from .tasks.router import router as tasks_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="DevBoard API",
    description="Kanban board task management API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(boards_router)
app.include_router(columns_router)
app.include_router(tasks_router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
