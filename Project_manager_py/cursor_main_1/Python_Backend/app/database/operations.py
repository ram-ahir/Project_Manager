import asyncpg
from typing import List, Optional, Dict, Any
from datetime import datetime
from .connection import db_manager

class DatabaseOperations:
    """Database operations for all tables"""
    
    # Database Table Operations
    @staticmethod
    async def get_all_databases() -> List[Dict[str, Any]]:
        """Get all databases"""
        async with db_manager.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM database_table ORDER BY database_id")
            return [dict(row) for row in rows]
    
    @staticmethod
    async def create_database(database_name: str) -> Dict[str, Any]:
        """Create a new database"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                "INSERT INTO database_table (database_name) VALUES ($1) RETURNING *",
                database_name
            )
            return dict(row)
    
    # Project Table Operations
    @staticmethod
    async def get_all_projects() -> List[Dict[str, Any]]:
        """Get all projects"""
        async with db_manager.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM project_table ORDER BY project_id")
            return [dict(row) for row in rows]
    
    @staticmethod
    async def get_project_by_id(project_id: int) -> Optional[Dict[str, Any]]:
        """Get project by ID"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM project_table WHERE project_id = $1",
                project_id
            )
            return dict(row) if row else None
    
    @staticmethod
    async def create_project(project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new project"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO project_table 
                   (project_name, project_description, database_id, database_path, project_path)
                   VALUES ($1, $2, $3, $4, $5) RETURNING *""",
                project_data['project_name'],
                project_data['project_description'],
                project_data['database_id'],
                project_data['database_path'],
                project_data['project_path']
            )
            return dict(row)
    
    @staticmethod
    async def update_project(project_id: int, project_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a project"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                """UPDATE project_table 
                   SET project_name = $1, project_description = $2, database_id = $3,
                       database_path = $4, project_path = $5
                   WHERE project_id = $6 RETURNING *""",
                project_data['project_name'],
                project_data['project_description'],
                project_data['database_id'],
                project_data['database_path'],
                project_data['project_path'],
                project_id
            )
            return dict(row) if row else None
    
    @staticmethod
    async def delete_project(project_id: int) -> bool:
        """Delete a project"""
        async with db_manager.pool.acquire() as conn:
            result = await conn.execute(
                "DELETE FROM project_table WHERE project_id = $1",
                project_id
            )
            return result == "DELETE 1"
    
    # Table Operations
    @staticmethod
    async def get_tables_by_project(project_id: int) -> List[Dict[str, Any]]:
        """Get all tables for a project"""
        async with db_manager.pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM all_table WHERE project_id = $1 ORDER BY table_id",
                project_id
            )
            return [dict(row) for row in rows]
    
    @staticmethod
    async def get_table_by_id(table_id: int) -> Optional[Dict[str, Any]]:
        """Get table by ID"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM all_table WHERE table_id = $1",
                table_id
            )
            return dict(row) if row else None
    
    @staticmethod
    async def create_table(table_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new table"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO all_table 
                   (project_id, table_name, table_description, is_generated, generated_date)
                   VALUES ($1, $2, $3, $4, $5) RETURNING *""",
                table_data['project_id'],
                table_data['table_name'],
                table_data['table_description'],
                table_data.get('is_generated', False),
                table_data.get('generated_date')
            )
            return dict(row)
    
    @staticmethod
    async def update_table(table_id: int, table_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a table"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                """UPDATE all_table 
                   SET table_name = $1, table_description = $2, is_generated = $3, generated_date = $4
                   WHERE table_id = $5 RETURNING *""",
                table_data['table_name'],
                table_data['table_description'],
                table_data.get('is_generated', False),
                table_data.get('generated_date'),
                table_id
            )
            return dict(row) if row else None
    
    @staticmethod
    async def delete_table(table_id: int) -> bool:
        """Delete a table"""
        async with db_manager.pool.acquire() as conn:
            result = await conn.execute(
                "DELETE FROM all_table WHERE table_id = $1",
                table_id
            )
            return result == "DELETE 1"
    
    @staticmethod
    async def get_table_name(table_id: int) -> Optional[str]:
        """Get table name by ID"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT table_name FROM all_table WHERE table_id = $1",
                table_id
            )
            return row['table_name'] if row else None
    
    # Field Operations
    @staticmethod
    async def get_fields_by_table(table_id: int) -> List[Dict[str, Any]]:
        """Get all fields for a table"""
        async with db_manager.pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM table_wise_field WHERE table_id = $1 ORDER BY table_wise_field_id",
                table_id
            )
            return [dict(row) for row in rows]
    
    @staticmethod
    async def get_field_by_id(field_id: int) -> Optional[Dict[str, Any]]:
        """Get field by ID"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM table_wise_field WHERE table_wise_field_id = $1",
                field_id
            )
            return dict(row) if row else None
    
    @staticmethod
    async def create_field(field_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new field"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                """INSERT INTO table_wise_field 
                   (table_id, field_name, field_datatype_id, is_primary, field_label, 
                    display_name, is_auto_increment, is_foreign_key, reference_table_id, 
                    reference_table_field_id)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *""",
                field_data['table_id'],
                field_data['field_name'],
                field_data['field_datatype_id'],
                field_data.get('is_primary', False),
                field_data.get('field_label'),
                field_data.get('display_name'),
                field_data.get('is_auto_increment', False),
                field_data.get('is_foreign_key', False),
                field_data.get('reference_table_id'),
                field_data.get('reference_table_field_id')
            )
            return dict(row)
    
    @staticmethod
    async def update_field(field_id: int, field_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a field"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                """UPDATE table_wise_field 
                   SET table_id = $1, field_name = $2, field_datatype_id = $3, is_primary = $4,
                       field_label = $5, display_name = $6, is_auto_increment = $7, 
                       is_foreign_key = $8, reference_table_id = $9, reference_table_field_id = $10
                   WHERE table_wise_field_id = $11 RETURNING *""",
                field_data['table_id'],
                field_data['field_name'],
                field_data['field_datatype_id'],
                field_data.get('is_primary', False),
                field_data.get('field_label'),
                field_data.get('display_name'),
                field_data.get('is_auto_increment', False),
                field_data.get('is_foreign_key', False),
                field_data.get('reference_table_id'),
                field_data.get('reference_table_field_id'),
                field_id
            )
            return dict(row) if row else None
    
    @staticmethod
    async def delete_field(field_id: int) -> bool:
        """Delete a field"""
        async with db_manager.pool.acquire() as conn:
            result = await conn.execute(
                "DELETE FROM table_wise_field WHERE table_wise_field_id = $1",
                field_id
            )
            return result == "DELETE 1"
    
    # Field Datatype Operations
    @staticmethod
    async def get_all_datatypes() -> List[Dict[str, Any]]:
        """Get all field datatypes"""
        async with db_manager.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM field_datatype ORDER BY field_datatype_id")
            return [dict(row) for row in rows]
    
    @staticmethod
    async def get_sql_type(datatype_id: int) -> str:
        """Get PostgreSQL type for a datatype ID"""
        async with db_manager.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT postgresql FROM field_datatype WHERE field_datatype_id = $1",
                datatype_id
            )
            return row['postgresql'] if row else 'TEXT'
    
    # SQL Generation
    @staticmethod
    async def generate_sql(table_id: int) -> str:
        """Generate SQL CREATE TABLE statement"""
        async with db_manager.pool.acquire() as conn:
            # Get table info
            table_row = await conn.fetchrow(
                "SELECT * FROM all_table WHERE table_id = $1",
                table_id
            )
            if not table_row:
                raise ValueError("Table not found")
            
            # Get fields
            field_rows = await conn.fetch(
                "SELECT * FROM table_wise_field WHERE table_id = $1 ORDER BY table_wise_field_id",
                table_id
            )
            
            table_name = table_row['table_name']
            sql = f"CREATE TABLE {table_name} (\n"
            
            # Build column definitions
            column_lines = []
            for field in field_rows:
                datatype = await DatabaseOperations.get_sql_type(field['field_datatype_id'])
                line = f"  {field['field_name']} {datatype}"
                
                if field['is_auto_increment']:
                    line += ' SERIAL'
                if field['is_primary']:
                    line += ' PRIMARY KEY'
                
                column_lines.append(line)
            
            sql += ',\n'.join(column_lines) + '\n);'
            return sql 