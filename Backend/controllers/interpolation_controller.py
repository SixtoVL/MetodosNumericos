from fastapi import HTTPException
from methods.interpolation.divided_differences import divided_differences_method
from methods.interpolation.finite_differences import finite_differences_method
from schemas.interpolation_schema import InterpolationSchema
import logging
import numpy as np
import json

logger = logging.getLogger("InterpolationController")

def solve_divided_differences(data: InterpolationSchema):
    metodo_solicitado = data.metodo
    metodo_nombre = "Diferencias Finitas" if metodo_solicitado == "finitas" else "Diferencias Divididas"
    
    # Pretty-print del JSON de entrada
    input_json = json.dumps(data.model_dump(), indent=2, ensure_ascii=False)
    logger.info(f"--- NUEVA PETICIÓN ({metodo_nombre}) ---\n{input_json}")
    
    try:
        # 1. Validaciones básicas
        x_values = [p.x for p in data.puntos]
        if len(x_values) != len(set(x_values)):
            logger.warning("Validación fallida: Valores de X repetidos")
            raise HTTPException(status_code=400, detail="Los valores de x deben ser distintos entre sí.")
            
        if len(data.puntos) < 2:
            logger.warning("Validación fallida: Menos de 2 puntos")
            raise HTTPException(status_code=400, detail="Se necesitan al menos 2 puntos para interpolar.")

        # 2. Análisis de espaciamiento (h)
        h_values = np.diff(x_values)
        es_equiespaciado = np.allclose(h_values, h_values[0], atol=1e-8)
        
        # 3. Lógica de decisión según el toggle y los datos
        if metodo_solicitado == "finitas":
            if not es_equiespaciado:
                logger.warning(f"Conflicto: Toggle ON pero puntos NO equiespaciados. h_values={h_values.tolist()}")
                raise HTTPException(
                    status_code=400, 
                    detail="Los puntos ingresados no tienen una distancia constante (equiespaciados). "
                           "Por favor, revisa tus datos o desactiva el toggle de Diferencias Finitas."
                )
            logger.info(f"Escenario detectado: Toggle ON + Puntos Equiespaciados ({data.direccion}) -> Usando Diferencias Finitas")
            resultado = finite_differences_method(data.puntos, direccion=data.direccion)
        else:
            if es_equiespaciado:
                logger.info("Escenario detectado: Toggle OFF + Puntos Equiespaciados -> Usando Diferencias Divididas")
            else:
                logger.info("Escenario detectado: Toggle OFF + Puntos Cualquiera -> Usando Diferencias Divididas")
            resultado = divided_differences_method(data.puntos)
        
        # 4. Evaluación del punto si se solicita
        if data.x_a_evaluar is not None:
            xa = data.x_a_evaluar
            coefs = resultado["coeficientes"]
            puntos_x = resultado["puntos_x"]
            
            valor_evaluado = coefs[0]
            producto = 1.0
            for i in range(1, len(coefs)):
                producto *= (xa - puntos_x[i-1])
                valor_evaluado += coefs[i] * producto
            
            resultado["valor_evaluado"] = {"x": xa, "y": valor_evaluado}
            
        # Pretty-print del JSON de salida
        output_json = json.dumps(resultado, indent=2, ensure_ascii=False)
        logger.info(f"Respuesta generada exitosamente:\n{output_json}")
        return resultado

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en solve_divided_differences: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
