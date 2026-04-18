from fastapi import HTTPException
from methods.fixed_point.fixed_point import fixed_point_method
from schemas.fixed_point_schema import FixedPointSchema
import logging
import json

logger = logging.getLogger("FixedPointController")

def solve_fixed_point(data: FixedPointSchema):
    """
    Controlador que orquest several el flujo del método de punto fijo
    """
    # Pretty-print del JSON de entrada
    input_json = json.dumps(data.model_dump(), indent=2, ensure_ascii=False)
    logger.info(f"Petición recibida (Punto Fijo):\n{input_json}")
    
    try:
        resultado = fixed_point_method(
            g_func=data.g_func,
            punto_inicial=data.punto_inicial,
            tolerancia=data.tolerancia,
            iteraciones=data.iteraciones,
            funciones_originales=data.funciones_originales
        )
        
        if "error" in resultado:
            logger.warning(f"Cálculo detenido (Punto Fijo): {resultado['error']}")
            # No lanzamos excepción, devolvemos el resultado parcial para que la UI lo pinte
            output_json = json.dumps(resultado, indent=2, ensure_ascii=False)
            logger.info(f"Respuesta parcial enviada:\n{output_json}")
            return resultado
            
        # Pretty-print del JSON de salida exitosa
        output_json = json.dumps(resultado, indent=2, ensure_ascii=False)
        logger.info(f"Respuesta generada (Punto Fijo):\n{output_json}")
        return resultado

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado en solve_fixed_point: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
