from pydantic import BaseModel
from typing import List, Optional

class Point(BaseModel):
    x: float
    y: float

class LeastSquaresRequest(BaseModel):
    puntos: List[Point]
    grado: int = 1 # 1: Lineal, 2: Cuadrático
    x_a_evaluar: Optional[float] = None
