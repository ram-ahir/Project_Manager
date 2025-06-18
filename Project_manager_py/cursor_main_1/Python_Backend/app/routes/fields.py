from fastapi import APIRouter, HTTPException, Query
from typing import List
from ..models.database_models import TableField, TableFieldCreate, TableFieldUpdate
from ..database.operations import DatabaseOperations

router = APIRouter(prefix="/api/fields", tags=["Fields"])

@router.get("/", response_model=List[TableField])
async def get_fields(table_id: int = Query(..., description="Table ID to filter fields")):
    """Get all fields for a table"""
    try:
        fields = await DatabaseOperations.get_fields_by_table(table_id)
        return fields
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{field_id}", response_model=TableField)
async def get_field(field_id: int):
    """Get field by ID"""
    try:
        field = await DatabaseOperations.get_field_by_id(field_id)
        if not field:
            raise HTTPException(status_code=404, detail="Field not found")
        return field
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/", response_model=TableField, status_code=201)
async def create_field(field: TableFieldCreate):
    """Create a new field"""
    try:
        field_data = await DatabaseOperations.create_field(field.dict())
        return field_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create field: {str(e)}")

@router.put("/{field_id}", response_model=TableField)
async def update_field(field_id: int, field: TableFieldUpdate):
    """Update a field"""
    try:
        # Filter out None values
        update_data = {k: v for k, v in field.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        field_data = await DatabaseOperations.update_field(field_id, update_data)
        if not field_data:
            raise HTTPException(status_code=404, detail="Field not found")
        return field_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update field: {str(e)}")

@router.delete("/{field_id}", status_code=204)
async def delete_field(field_id: int):
    """Delete a field"""
    try:
        success = await DatabaseOperations.delete_field(field_id)
        if not success:
            raise HTTPException(status_code=404, detail="Field not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete field: {str(e)}") 