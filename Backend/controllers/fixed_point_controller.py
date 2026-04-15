from fastapi import HTTPException
from methods.fixed_point.fixed_point import fixed_point_method
from schemas.fixed_point_schema import FixedPointSchema

def solve_fixed_point(data: FixedPointSchema):
    """
    Controlador que orquest several el flujo del método de punto fijo:
    1. Recibe y valida los datos mediante el esquema de Pydantic.
    2. Invoca el algoritmo principal con los parámetros proporcionados.
    3. Gestiona excepciones y errores de convergencia para devolver códigos HTTP adecuados.
    """
    try:
        resultado = fixed_point_method(
            g_func=data.g_func,
            punto_inicial=data.punto_inicial,
            tolerancia=data.tolerancia,
            iteraciones=data.iteraciones
        )
        
        if "error" in resultado:
            raise HTTPException(status_code=400, detail=resultado["error"])
            
        return resultado

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
