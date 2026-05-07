from pydantic import BaseModel
from typing import List, Optional

class Point(BaseModel):
    x: float
    y: float

class InterpolationSchema(BaseModel):
    puntos: List[Point]
    x_a_evaluar: Optional[float] = None
    metodo: Optional[str] = "divididas"  # "divididas" o "finitas"
    direccion: Optional[str] = "adelante"  # "adelante" o "atras"
