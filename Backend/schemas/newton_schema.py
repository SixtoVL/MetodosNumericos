from pydantic import BaseModel
from typing import List

class NewtonSchema(BaseModel):
    funciones: List[str]
    punto_inicial: List[float]
    tolerancia: float
    iteraciones: int