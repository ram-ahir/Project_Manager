from fastapi import APIRouter, HTTPException, Query
from ..models.database_models import SQLGenerationResponse
from ..database.operations import DatabaseOperations

router = APIRouter(prefix="/api", tags=["SQL Generation"])

@router.get("/generate-sql", response_model=SQLGenerationResponse)
async def generate_sql(table_id: int = Query(..., description="Table ID to generate SQL for")):
    """Generate SQL CREATE TABLE statement for a table"""
    try:
        sql_query = await DatabaseOperations.generate_sql(table_id)
        return {"query": sql_query}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate SQL: {str(e)}") 