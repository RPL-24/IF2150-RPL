from fastapi import APIRouter
from backend.schemas.item import Item

router = APIRouter()

@router.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "query": q}

@router.post("/items/")
def create_item(item: Item):
    return {"message": "Item created successfully", "item": item}