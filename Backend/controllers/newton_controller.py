from fastapi import HTTPException
from methods.newton.newton import newton_method
from schemas.newton_schema import NewtonSchema
import logging
import json

logger = logging.getLogger("NewtonController")

def solve_newton(data: NewtonSchema):
    # Pretty-print del JSON de entrada
    input_json = json.dumps(data.model_dump(), indent=2, ensure_ascii=False)
    logger.info(f"Petición recibida (Newton-Raphson):\n{input_json}")
    
    try:
        resultado = newton_method(
            funciones=data.funciones,
            punto_inicial=data.punto_inicial,
            tolerancia=data.tolerancia,
            iteraciones=data.iteraciones
        )
        
        if "error" in resultado:
            logger.warning(f"Cálculo detenido (Newton-Raphson): {resultado['error']}")
            # Devolvemos el resultado parcial
            output_json = json.dumps(resultado, indent=2, ensure_ascii=False)
            logger.info(f"Respuesta parcial enviada:\n{output_json}")
            return resultado
            
        # Pretty-print del JSON de salida exitosa
        output_json = json.dumps(resultado, indent=2, ensure_ascii=False)
        logger.info(f"Respuesta generada (Newton-Raphson):\n{output_json}")
        return resultado

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado en solve_newton: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))