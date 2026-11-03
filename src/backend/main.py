from fastapi import FastAPI
from . import models
from . import database
from .database import engine, Base

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Database initialized successfully!"}