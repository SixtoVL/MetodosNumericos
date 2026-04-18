import numpy as np
import sympy as sp
from .helpers.parser_punto_fijo import obtener_funciones_punto_fijo, pre_procesar_implicit_mult
import logging

logger = logging.getLogger("FixedPointMethod")

def fixed_point_method(g_func: any, punto_inicial: any, tolerancia: float, iteraciones: int, funciones_originales: list = None):
    """
    Algoritmo de Punto Fijo para ecuaciones univariadas y sistemas de ecuaciones multivariables.
    """
    logger.info("Iniciando algoritmo de Punto Fijo (Gauss-Seidel)...")
    # Normalizar entradas
    if isinstance(g_func, str):
        g_funcs = [g_func]
    else:
        g_funcs = g_func
        
    if isinstance(punto_inicial, (int, float)):
        x0 = [float(punto_inicial)]
    else:
        x0 = [float(v) for v in punto_inicial]
        
    n_vars = len(x0)
    variables_str = [f"x_{i+1}" for i in range(n_vars)]
    
    try:
        g_num, exprs, simbolos, latex_g = obtener_funciones_punto_fijo(g_funcs, variables_str)
    except Exception as e:
        logger.error(f"Error en el parser simbólico: {str(e)}")
        return {"error": f"Error en el Parser: {str(e)}", "tabla": {"cabecera": [], "filas": []}}

    x = np.array(x0, dtype=float)
    
    # Cabecera de la tabla
    cabecera = [
        "n", 
        *[f"x_{i+1}" for i in range(n_vars)], 
        "Error Absoluto",
        "Error Relativo"
    ]
    
    filas = []
    procedimiento_detallado = []
    convergio = False
    mensaje = "Se alcanzó el máximo de iteraciones sin converger."

    # Iteración 0 (Punto inicial)
    fila_0 = [0] + [round(float(v), 8) for v in x] + [0.0, 0.0]
    filas.append(fila_0)

    # Obtenemos las funciones individuales para desplazamientos sucesivos
    try:
        g_individuales = [sp.lambdify(simbolos, expr, 'numpy') for expr in exprs]
    except Exception as e:
        logger.error(f"Error al generar funciones individuales: {str(e)}")
        return {"error": f"Error al generar funciones individuales: {str(e)}"}

    # 1. Preparar datos base que siempre deben estar presentes
    # Generar representaciones en LaTeX
    latex_g = [sp.latex(expr) for expr in exprs]
    
    # Datos iniciales para GeoGebra
    funciones_geogebra = []
    target_funcs = funciones_originales if funciones_originales and len(funciones_originales) > 0 else g_funcs
    for f_s in target_funcs:
        f_limpia = pre_procesar_implicit_mult(f_s)
        f_g = f_limpia.replace("x_1", "x").replace("x_2", "y").replace("x_3", "z")
        funciones_geogebra.append(f_g)

    # Estructura base para el éxito o error parcial
    resultado_base = {
        "convergio": False,
        "formulas": {
            "g_latex": latex_g,
            "metodo": "X^{(k+1)} = G(X^{(k)})",
            "tipo_desplazamiento": "Sucesivos" 
        },
        "funciones_geogebra": funciones_geogebra,
        "procedimiento": procedimiento_detallado,
        "raiz": [round(float(v), 10) for v in x]
    }

    for i in range(iteraciones):
        try:
            x_viejo = np.copy(x)
            x_nuevo = np.copy(x)
            
            # Evaluación con Desplazamientos Sucesivos (Gauss-Seidel)
            for j in range(n_vars):
                try:
                    with np.errstate(all='raise'):
                        res_val = g_individuales[j](*x_nuevo)
                    
                    if np.isnan(res_val) or np.isinf(res_val):
                        raise ValueError("Resultado no definido (NaN/Inf)")
                    
                    if abs(res_val) > 1e100:
                        raise ValueError("Divergencia extrema (>10^100)")
                        
                    x_nuevo[j] = float(res_val)
                except Exception as eval_err:
                    logger.warning(f"Iteración {i+1}: Error matemático en g_{j+1} -> {str(eval_err)}")
                    return {
                        **resultado_base,
                        "error": f"Divergencia o error matemático en iteración {i+1}: {str(eval_err)}", 
                        "tabla": {"cabecera": cabecera, "filas": filas},
                        "raiz": [round(float(v), 10) for v in x]
                    }

            error_abs = np.linalg.norm(x_nuevo - x_viejo)
            error_rel = error_abs / np.linalg.norm(x_nuevo) if np.linalg.norm(x_nuevo) > 0 else 0
            
            # ... (resto de la lógica de guardado)
            paso_detalle = {
                "n": i + 1,
                "x_actual": [round(float(v), 8) for v in x_viejo],
                "g_evaluada": [round(float(v), 8) for v in x_nuevo],
                "error_absoluto": round(float(error_abs), 10),
                "error_relativo": round(float(error_rel), 10)
            }
            procedimiento_detallado.append(paso_detalle)
            
            fila_actual = [i + 1] 
            fila_actual += [round(float(v), 8) for v in x_nuevo]
            fila_actual += [round(float(error_abs), 10), round(float(error_rel), 10)]
            filas.append(fila_actual)
            
            x = x_nuevo
            
            if error_abs < tolerancia:
                convergio = True
                mensaje = "Convergencia alcanzada con éxito."
                logger.info(f"Convergencia lograda en {i+1} iteraciones.")
                break
                
        except Exception as e:
            logger.error(f"Error inesperado en ciclo iterativo: {str(e)}")
            return {"error": f"Error en iteración {i+1}: {str(e)}", "tabla": {"cabecera": cabecera, "filas": filas}}

    if not convergio:
        logger.warning(f"No se alcanzó la convergencia en {iteraciones} iteraciones.")
        if len(procedimiento_detallado) >= 2:
            e_n = procedimiento_detallado[-1]["error_absoluto"]
            e_prev = procedimiento_detallado[-2]["error_absoluto"]
            if e_n < e_prev:
                mensaje = f"No se alcanzó la tolerancia en {iteraciones} iteraciones, pero el error está disminuyendo (Tendencia Convergente). ¡Prueba aumentando el número de iteraciones!"
            elif e_n > e_prev * 1.05:
                mensaje = "El método parece estar divergiendo (el error aumenta). Revisa tus despejes g(x) o intenta con un punto inicial más cercano a la raíz."
            else:
                mensaje = "El método presenta una tendencia inestable u oscilatoria. Es posible que este despeje g(x) no cumpla con el criterio de convergencia (|g'(x)| < 1)."
        else:
            mensaje = "Se alcanzó el máximo de iteraciones. Intenta aumentar el límite para ver la tendencia."

    # Datos para GeoGebra
    funciones_geogebra = []
    target_funcs = funciones_originales if funciones_originales and len(funciones_originales) > 0 else g_funcs
    
    for f_s in target_funcs:
        f_limpia = pre_procesar_implicit_mult(f_s)
        # Traducción: x_1 -> x, x_2 -> y, x_3 -> z y potencias Python -> GGB
        f_g = f_limpia.replace("x_1", "x").replace("x_2", "y").replace("x_3", "z").replace("**", "^")
        funciones_geogebra.append(f_g)

    logger.info(f"Funciones enviadas a GeoGebra (Punto Fijo): {funciones_geogebra}")

    return {
        "raiz": [round(float(v), 10) for v in x],
        "convergio": convergio,
        "mensaje": mensaje,
        "formulas": {
            "g_latex": latex_g,
            "metodo": "X^{(k+1)} = G(X^{(k)})",
            "tipo_desplazamiento": "Sucesivos" 
        },
        "funciones_geogebra": funciones_geogebra,
        "tabla": {
            "cabecera": cabecera,
            "filas": filas
        },
        "procedimiento": procedimiento_detallado
    }
