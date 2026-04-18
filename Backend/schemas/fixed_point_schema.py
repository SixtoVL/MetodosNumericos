from pydantic import BaseModel
from typing import List, Union, Optional

class FixedPointSchema(BaseModel):
    g_func: Union[str, List[str]]
    punto_inicial: Union[float, List[float]]
    tolerancia: float
    iteraciones: int
    funciones_originales: Optional[List[str]] = None
