from pydantic import BaseModel
from typing import List, Optional

class Point(BaseModel):
    x: float
    y: float

class InterpolationSchema(BaseModel):
    puntos: List[Point]
    x_a_evaluar: Optional[float] = None
