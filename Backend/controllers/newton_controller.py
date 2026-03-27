from fastapi import HTTPException
from methods.newton.newton import newton_method
from schemas.newton_schema import NewtonSchema

def solve_newton(data: NewtonSchema):
    try:
        resultado = newton_method(
            funciones=data.funciones,
            punto_inicial=data.punto_inicial,
            tolerancia=data.tolerancia,
            iteraciones=data.iteraciones
        )
        
        if "error" in resultado:
            raise HTTPException(status_code=400, detail=resultado["error"])
            
        return resultado

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))