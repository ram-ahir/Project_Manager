from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from ..database.operations import DatabaseOperations

router = APIRouter(prefix="/api", tags=["General"])

@router.get("/gettablename")
async def get_table_name(table_id: int = Query(..., description="Table ID")):
    """Get table name by table ID"""
    try:
        table_name = await DatabaseOperations.get_table_name(table_id)
        if not table_name:
            raise HTTPException(status_code=404, detail="Table not found")
        return {"table_name": table_name}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/datatype", response_model=List[Dict[str, Any]])
async def get_datatypes():
    """Get all field datatypes"""
    try:
        datatypes = await DatabaseOperations.get_all_datatypes()
        return datatypes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 