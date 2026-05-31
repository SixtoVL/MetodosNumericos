from pydantic import BaseModel
from typing import List, Optional

class Point(BaseModel):
    x: float
    y: float

class HermitePoint(BaseModel):
    x: float
    y: float
    derivadas: Optional[List[float]] = [] # [f'(x), f''(x), ...]

class InterpolationSchema(BaseModel):
    puntos: List[Point]
    x_a_evaluar: Optional[float] = None
    metodo: Optional[str] = "divididas"
    direccion: Optional[str] = "adelante"
    pivote: Optional[int] = 0

class HermiteRequest(BaseModel):
    # Modo manual
    puntos: Optional[List[HermitePoint]] = None
    # Modo simbólico
    funcion: Optional[str] = None
    x_puntos: Optional[List[float]] = None
    ordenes: Optional[List[int]] = None # Número de derivadas por cada x_punto (ej: [1, 1] significa f'(x) para cada punto)
    
    x_a_evaluar: Optional[float] = None
