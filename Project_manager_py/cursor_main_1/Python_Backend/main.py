import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database.connection import db_manager
from app.routes import database, projects, tables, fields, sql_generation, general

load_dotenv()

app = FastAPI(title="Project Manager API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db_manager.create_pool()

@app.on_event("shutdown")
async def shutdown():
    await db_manager.close_pool()

# Include routers
app.include_router(database.router)
app.include_router(projects.router)
app.include_router(tables.router)
app.include_router(fields.router)
app.include_router(sql_generation.router)
app.include_router(general.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Project Manager API!"} 