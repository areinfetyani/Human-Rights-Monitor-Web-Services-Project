import os
from fastapi import FastAPI
from app.routes import case_routes
from app.routes import report_routes
from app.routes import victim_routes
from app.routes import analysis_routes

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


os.makedirs("Evidence", exist_ok=True)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/Evidence", StaticFiles(directory="Evidence"), name="Evidence")


app.include_router(case_routes.router, prefix="/cases", tags=["cases"])
app.include_router(report_routes.router, prefix="/reports", tags=["reports"])
app.include_router(victim_routes.router, prefix="/victims", tags=["victims"])

app.include_router(analysis_routes.router, prefix="/analytics", tags=["analytics"])
