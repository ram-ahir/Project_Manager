from fastapi import APIRouter, HTTPException
from typing import List
from ..models.database_models import Database, DatabaseCreate
from ..database.operations import DatabaseOperations

router = APIRouter(prefix="/api/database", tags=["Database"])

@router.get("/", response_model=List[Database])
async def get_databases():
    """Get all databases"""
    try:
        databases = await DatabaseOperations.get_all_databases()
        return databases
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/", response_model=Database)
async def create_database(database: DatabaseCreate):
    """Create a new database"""
    try:
        database_data = await DatabaseOperations.create_database(database.database_name)
        return database_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create database: {str(e)}") 