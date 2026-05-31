from fastapi import HTTPException
from methods.least_squares.least_squares import least_squares_method
from schemas.least_squares_schema import LeastSquaresRequest
import logging
import numpy as np
import json
import sympy as sp

logger = logging.getLogger("LeastSquaresController")

def solve_least_squares(data: LeastSquaresRequest):
    input_json = json.dumps(data.model_dump(), indent=2, ensure_ascii=False)
    logger.info(f"--- NUEVA PETICIÓN (Mínimos Cuadrados) ---\n{input_json}")
    
    try:
        if len(data.puntos) < (data.grado + 1):
            raise HTTPException(
                status_code=400, 
                detail=f"Se necesitan al menos {data.grado + 1} puntos para un ajuste de grado {data.grado}."
            )

        # 1. Ejecutar el método
        resultado = least_squares_method(data.puntos, data.grado)
        poly_expr = resultado.pop("poly_expr")
        x_sym = sp.Symbol('x')

        # 2. Evaluación del punto si se solicita
        if data.x_a_evaluar is not None:
            xa = data.x_a_evaluar
            val_ev = float(poly_expr.subs(x_sym, xa))
            resultado["valor_evaluado"] = {"x": xa, "y": val_ev}

        # 3. Generación de puntos para la curva (Graficación)
        x_vals = resultado["puntos_x"]
        x_min, x_max = min(x_vals), max(x_vals)
        rango = x_max - x_min
        padding = rango * 0.2 if rango > 0 else 1.0
        
        x_plot = np.linspace(x_min - padding, x_max + padding, 200)
        curva = []
        for x_val in x_plot:
            y_val = float(poly_expr.subs(x_sym, x_val))
            if abs(y_val) < 1e100:
                curva.append({"x": float(x_val), "y": float(y_val)})
        
        resultado["curva"] = curva
        
        logger.info("Respuesta Mínimos Cuadrados generada exitosamente")
        return resultado

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en solve_least_squares: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
