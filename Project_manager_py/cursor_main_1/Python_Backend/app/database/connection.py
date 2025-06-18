import os
import asyncpg
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None
    
    async def create_pool(self):
        """Create database connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                host=os.getenv("PGHOST", "localhost"),
                user=os.getenv("PGUSER"),
                password=os.getenv("PGPASSWORD"),
                database=os.getenv("PGDATABASE"),
                port=int(os.getenv("PGPORT", "5432")),
                min_size=1,
                max_size=10
            )
            print("Database connection pool created successfully")
            return self.pool
        except Exception as e:
            print(f"Failed to create database pool: {e}")
            raise e
    
    async def close_pool(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            print("Database connection pool closed")
    
    async def get_connection(self):
        """Get a connection from the pool"""
        if not self.pool:
            raise Exception("Database pool not initialized")
        return await self.pool.acquire()
    
    async def release_connection(self, conn):
        """Release a connection back to the pool"""
        if self.pool:
            await self.pool.release(conn)

# Global database manager instance
db_manager = DatabaseManager() 