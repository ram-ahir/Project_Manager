from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Database Table Models
class DatabaseBase(BaseModel):
    database_name: str = Field(..., max_length=255)

class DatabaseCreate(DatabaseBase):
    pass

class Database(DatabaseBase):
    database_id: int
    
    class Config:
        from_attributes = True

# Project Table Models
class ProjectBase(BaseModel):
    project_name: str = Field(..., max_length=255)
    project_description: Optional[str] = None
    database_id: int
    database_path: Optional[str] = None
    project_path: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = Field(None, max_length=255)
    project_description: Optional[str] = None
    database_id: Optional[int] = None
    database_path: Optional[str] = None
    project_path: Optional[str] = None

class Project(ProjectBase):
    project_id: int
    
    class Config:
        from_attributes = True

# Table Models
class TableBase(BaseModel):
    project_id: int
    table_name: str = Field(..., max_length=255)
    table_description: Optional[str] = None
    is_generated: bool = False
    generated_date: Optional[datetime] = None

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    table_name: Optional[str] = Field(None, max_length=255)
    table_description: Optional[str] = None
    is_generated: Optional[bool] = None
    generated_date: Optional[datetime] = None

class Table(TableBase):
    table_id: int
    
    class Config:
        from_attributes = True

# Field Datatype Models
class FieldDatatypeBase(BaseModel):
    display_name: str = Field(..., max_length=100)
    postgresql: Optional[str] = Field(None, max_length=100)
    mysql: Optional[str] = Field(None, max_length=100)
    mongodb: Optional[str] = Field(None, max_length=100)

class FieldDatatypeCreate(FieldDatatypeBase):
    pass

class FieldDatatype(FieldDatatypeBase):
    field_datatype_id: int
    
    class Config:
        from_attributes = True

# Table Field Models
class TableFieldBase(BaseModel):
    table_id: int
    field_name: str = Field(..., max_length=255)
    field_datatype_id: int
    is_primary: bool = False
    field_label: Optional[str] = Field(None, max_length=255)
    display_name: Optional[str] = Field(None, max_length=255)
    is_auto_increment: bool = False
    is_foreign_key: bool = False
    reference_table_id: Optional[int] = None
    reference_table_field_id: Optional[int] = None

class TableFieldCreate(TableFieldBase):
    pass

class TableFieldUpdate(BaseModel):
    table_id: Optional[int] = None
    field_name: Optional[str] = Field(None, max_length=255)
    field_datatype_id: Optional[int] = None
    is_primary: Optional[bool] = None
    field_label: Optional[str] = Field(None, max_length=255)
    display_name: Optional[str] = Field(None, max_length=255)
    is_auto_increment: Optional[bool] = None
    is_foreign_key: Optional[bool] = None
    reference_table_id: Optional[int] = None
    reference_table_field_id: Optional[int] = None

class TableField(TableFieldBase):
    table_wise_field_id: int
    
    class Config:
        from_attributes = True

# SQL Generation Models
class SQLGenerationRequest(BaseModel):
    table_id: int

class SQLGenerationResponse(BaseModel):
    query: str

# Table Name Response
class TableNameResponse(BaseModel):
    table_name: str 