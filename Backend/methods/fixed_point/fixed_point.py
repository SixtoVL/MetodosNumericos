import numpy as np
import sympy as sp
from .helpers.parser_punto_fijo import obtener_funciones_punto_fijo, pre_procesar_implicit_mult

def fixed_point_method(g_func: any, punto_inicial: any, tolerancia: float, iteraciones: int):
    """
    Algoritmo de Punto Fijo para ecuaciones univariadas y sistemas de ecuaciones multivariables.
    
    Flujo de ejecución:
    1. Normalización de entradas (soporte para string único o lista de strings).
    2. Parsing simbólico de g(x) y lambdificación para alto rendimiento con NumPy.
    3. Ciclo iterativo utilizando Desplazamientos Simultáneos (tipo Jacobi).
    4. Cálculo de errores (Norma Euclídea para sistemas).
    5. Preparación de datos enriquecidos para el Frontend (Tablas, Procedimiento, GeoGebra).
    """
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
        return {"error": f"Error en el Parser: {str(e)}", "tabla": {"cabecera": [], "filas": []}}

    x = np.array(x0, dtype=float)
    
    # Cabecera de la tabla
    cabecera = [
        "n", 
        *[f"x_{i+1}" for i in range(n_vars)], 
        *[f"g_{i+1}(x)" for i in range(len(g_funcs))],
        "Error Absoluto",
        "Error Relativo"
    ]
    
    filas = []
    procedimiento_detallado = []
    convergio = False
    mensaje = "Se alcanzó el máximo de iteraciones sin converger."

    # Iteración 0 (Punto inicial)
    try:
        g_val_inicial = np.array(g_num(*x), dtype=float).flatten()
        fila_0 = [0] + [round(float(v), 8) for v in x] + [round(float(v), 8) for v in g_val_inicial] + [0.0, 0.0]
        filas.append(fila_0)
    except Exception as e:
        return {"error": f"Error en evaluación inicial: {str(e)}"}

    for i in range(iteraciones):
        try:
            # Evaluación: x_{k+1} = g(x_k)
            g_eval = np.array(g_num(*x), dtype=float).flatten()
            
            error_abs = np.linalg.norm(g_eval - x)
            error_rel = error_abs / np.linalg.norm(g_eval) if np.linalg.norm(g_eval) > 0 else 0
            
            paso_detalle = {
                "n": i + 1,
                "x_actual": [round(float(v), 8) for v in x],
                "g_evaluada": [round(float(v), 8) for v in g_eval],
                "error_absoluto": round(float(error_abs), 10),
                "error_relativo": round(float(error_rel), 10)
            }
            
            procedimiento_detallado.append(paso_detalle)
            
            # Guardar en la tabla
            fila_actual = [i + 1] 
            fila_actual += [round(float(v), 8) for v in x]
            fila_actual += [round(float(v), 8) for v in g_eval]
            fila_actual += [round(float(error_abs), 10), round(float(error_rel), 10)]
            filas.append(fila_actual)
            
            # Actualización
            x = g_eval
            
            if error_abs < tolerancia:
                convergio = True
                mensaje = "Convergencia alcanzada con éxito."
                break
                
        except Exception as e:
            return {"error": f"Error en iteración {i+1}: {str(e)}", "tabla": {"cabecera": cabecera, "filas": filas}}

    # Datos para GeoGebra (Mapeo idéntico a Newton)
    funciones_geogebra = []
    for g_s in g_funcs:
        f_limpia = pre_procesar_implicit_mult(g_s)
        # Traducción idéntica a Newton: x_1 -> x, x_2 -> y, x_3 -> z
        f_g = f_limpia.replace("x_1", "x").replace("x_2", "y").replace("x_3", "z")
        funciones_geogebra.append(f_g)

    return {
        "raiz": [round(float(v), 10) for v in x],
        "convergio": convergio,
        "mensaje": mensaje,
        "formulas": {
            "g_latex": latex_g,
            "metodo": "X^{(k+1)} = G(X^{(k)})",
            "tipo_desplazamiento": "Simultaneos" 
        },
        "funciones_geogebra": funciones_geogebra,
        "tabla": {
            "cabecera": cabecera,
            "filas": filas
        },
        "procedimiento": procedimiento_detallado
    }
