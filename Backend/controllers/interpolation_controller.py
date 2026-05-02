from fastapi import HTTPException
from methods.interpolation.divided_differences import divided_differences_method
from schemas.interpolation_schema import InterpolationSchema
import logging

logger = logging.getLogger("InterpolationController")

def solve_divided_differences(data: InterpolationSchema):
    logger.info(f"Petición recibida (Diferencias Divididas): {len(data.puntos)} puntos")
    
    try:
        # Validar que no haya x repetidas
        x_values = [p.x for p in data.puntos]
        if len(x_values) != len(set(x_values)):
            raise HTTPException(status_code=400, detail="Los valores de x deben ser distintos entre sí.")
            
        if len(data.puntos) < 2:
            raise HTTPException(status_code=400, detail="Se necesitan al menos 2 puntos para interpolar.")

        resultado = divided_differences_method(data.puntos)
        
        # Si se pidió evaluar un punto
        if data.x_a_evaluar is not None:
            xa = data.x_a_evaluar
            coefs = resultado["coeficientes"]
            puntos_x = resultado["puntos_x"]
            
            # Evaluación usando la forma de Newton
            valor_evaluado = coefs[0]
            producto = 1.0
            for i in range(1, len(coefs)):
                producto *= (xa - puntos_x[i-1])
                valor_evaluado += coefs[i] * producto
            
            resultado["valor_evaluado"] = {
                "x": xa,
                "y": valor_evaluado
            }
            
        return resultado

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en solve_divided_differences: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
