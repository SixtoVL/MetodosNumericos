from pydantic import BaseModel
from typing import List, Optional

class Point(BaseModel):
    x: float
    y: float

class HermitePoint(BaseModel):
    x: float
    y: float
    dy: float # f'(x)

class InterpolationSchema(BaseModel):
    puntos: List[Point]
    x_a_evaluar: Optional[float] = None
    metodo: Optional[str] = "divididas"
    direccion: Optional[str] = "adelante"
    pivote: Optional[int] = 0

class HermiteRequest(BaseModel):
    puntos: List[HermitePoint]
    x_a_evaluar: Optional[float] = None
