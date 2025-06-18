from fastapi import APIRouter, HTTPException, Query
from typing import List
from ..models.database_models import Table, TableCreate, TableUpdate
from ..database.operations import DatabaseOperations

router = APIRouter(prefix="/api/tables", tags=["Tables"])

@router.get("/", response_model=List[Table])
async def get_tables(project_id: int = Query(..., description="Project ID to filter tables")):
    """Get all tables for a project"""
    try:
        tables = await DatabaseOperations.get_tables_by_project(project_id)
        return tables
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{table_id}", response_model=Table)
async def get_table(table_id: int):
    """Get table by ID"""
    try:
        table = await DatabaseOperations.get_table_by_id(table_id)
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")
        return table
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/", response_model=Table, status_code=201)
async def create_table(table: TableCreate):
    """Create a new table"""
    try:
        table_data = await DatabaseOperations.create_table(table.dict())
        return table_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create table: {str(e)}")

@router.put("/{table_id}", response_model=Table)
async def update_table(table_id: int, table: TableUpdate):
    """Update a table"""
    try:
        # Filter out None values
        update_data = {k: v for k, v in table.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        table_data = await DatabaseOperations.update_table(table_id, update_data)
        if not table_data:
            raise HTTPException(status_code=404, detail="Table not found")
        return table_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update table: {str(e)}")

@router.delete("/{table_id}", status_code=204)
async def delete_table(table_id: int):
    """Delete a table"""
    try:
        success = await DatabaseOperations.delete_table(table_id)
        if not success:
            raise HTTPException(status_code=404, detail="Table not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete table: {str(e)}") 