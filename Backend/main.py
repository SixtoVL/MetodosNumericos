from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.methods_routes import router as methods_router

app = FastAPI()

# Configuración de CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos las rutas con el prefijo /methods
app.include_router(methods_router, prefix="/methods", tags=["Methods"])

@app.get("/")
def home():
    return {"mensaje": "API de Métodos Numéricos funcionando correctamente"}
