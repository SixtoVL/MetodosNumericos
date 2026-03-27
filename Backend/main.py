from fastapi import FastAPI
from routes.methods_routes import router as methods_router

app = FastAPI()

# Incluimos las rutas con el prefijo /methods
app.include_router(methods_router, prefix="/methods", tags=["Methods"])

@app.get("/")
def home():
    return {"mensaje": "API de Métodos Numéricos funcionando con arquitectura modular 🚀"}
