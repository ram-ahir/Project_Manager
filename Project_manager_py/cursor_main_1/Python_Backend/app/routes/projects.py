from fastapi import APIRouter, HTTPException
from typing import List
from ..models.database_models import Project, ProjectCreate, ProjectUpdate
from ..database.operations import DatabaseOperations

router = APIRouter(prefix="/api/project", tags=["Projects"])

@router.get("/", response_model=List[Project])
async def get_projects():
    """Get all projects"""
    try:
        projects = await DatabaseOperations.get_all_projects()
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: int):
    """Get project by ID"""
    try:
        project = await DatabaseOperations.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/", response_model=Project, status_code=201)
async def create_project(project: ProjectCreate):
    """Create a new project"""
    try:
        project_data = await DatabaseOperations.create_project(project.dict())
        return project_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.put("/{project_id}", response_model=Project)
async def update_project(project_id: int, project: ProjectUpdate):
    """Update a project"""
    try:
        # Filter out None values
        update_data = {k: v for k, v in project.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        project_data = await DatabaseOperations.update_project(project_id, update_data)
        if not project_data:
            raise HTTPException(status_code=404, detail="Project not found")
        return project_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: int):
    """Delete a project"""
    try:
        success = await DatabaseOperations.delete_project(project_id)
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}") 