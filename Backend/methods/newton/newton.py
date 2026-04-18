import numpy as np
from .helpers.calcular_jacobiano import calcular_jacobiano_analitico
import logging

logger = logging.getLogger("NewtonMethod")

def newton_method(funciones: list, punto_inicial: list, tolerancia: float, iteraciones: int):
    """
    Algoritmo de Newton-Raphson con soporte de procedimiento detallado para la UI.
    """
    logger.info("Iniciando algoritmo de Newton-Raphson Analítico...")
    n_vars = len(punto_inicial)
    variables_str = [f"x_{i+1}" for i in range(n_vars)]
    
    # 1. Obtener funciones y Jacobiano analítico con sus versiones en LaTeX
    try:
        res_jac = calcular_jacobiano_analitico(funciones, variables_str)
        f_eval, j_eval = res_jac["f_eval"], res_jac["j_eval"]
        formula_latex = res_jac["latex"]
        logger.info("Parser simbólico y Jacobiano analítico generados con éxito.")
    except Exception as e:
        logger.error(f"Error en el parser o cálculo del Jacobiano: {str(e)}")
        return {"error": f"Error en el Parser: {str(e)}", "tabla": {"cabecera": [], "filas": []}}

    # Preparar datos base para GeoGebra
    from .helpers.parser_matematico import pre_procesar_implicit_mult
    funciones_geogebra = []
    for f_s in funciones:
        f_limpia = pre_procesar_implicit_mult(f_s)
        # Traducción: x_1 -> x, x_2 -> y, x_3 -> z y potencias Python -> GGB
        f_g = f_limpia.replace("x_1", "x").replace("x_2", "y").replace("x_3", "z").replace("**", "^")
        funciones_geogebra.append(f_g)
    
    logger.info(f"Funciones enviadas a GeoGebra (Newton): {funciones_geogebra}")

    x = np.array(punto_inicial, dtype=float)
    filas = []
    procedimiento_detallado = []
    convergio = False
    mensaje = "Se alcanzó el máximo de iteraciones sin converger."

    # Datos para la tabla clásica
    cabecera = [
        "n", 
        *[f"x_{i+1}" for i in range(n_vars)], 
        *[f"f_{i+1}" for i in range(len(funciones))], 
        "||x_{k+1}-x_k||", 
        "\\frac{||x_{k+1}-x_k||}{||x_{k+1}||}", 
        "||f(x_k)||"
    ]

    # Estructura base para el éxito o error parcial
    resultado_base = {
        "convergio": False,
        "formulas": formula_latex,
        "funciones_geogebra": funciones_geogebra,
        "procedimiento": procedimiento_detallado,
        "raiz": [round(float(v), 10) for v in x]
    }

    for i in range(iteraciones):
        # Actualizamos el resultado base en cada paso para que la UI tenga lo más reciente si algo falla
        resultado_base["raiz"] = [round(float(v), 10) for v in x]
        resultado_base["procedimiento"] = procedimiento_detallado
        
        try:
            # 2. Evaluación de F y J en el punto actual con captura de errores matemáticos
            try:
                with np.errstate(all='raise'):
                    F = np.array(f_eval(*x), dtype=float).flatten()
                    J = np.array(j_eval(*x), dtype=float)
                
                if np.any(np.isnan(F)) or np.any(np.isinf(F)) or np.any(np.isnan(J)) or np.any(np.isinf(J)):
                    raise ValueError("Se detectaron valores no definidos (NaN/Inf) al evaluar las funciones o el Jacobiano.")
            except Exception as eval_err:
                logger.warning(f"Iteración {i+1}: Error matemático en evaluación -> {str(eval_err)}")
                return {
                    **resultado_base,
                    "error": f"Error matemático en iteración {i+1}: {str(eval_err)}", 
                    "tabla": {"cabecera": cabecera, "filas": filas}
                }
            
            # 3. Guardamos los detalles intermedios
            paso_detalle = {
                "n": i + 1,
                "x_actual": [round(float(v), 8) for v in x],
                "f_evaluada": [round(float(v), 8) for v in F],
                "jacobiano_evaluado": [[round(float(v), 8) for v in row] for row in J],
                "sistema_ecuacion": f"J * Δx = -F"
            }
            
            # 4. Resolver el paso delta_x
            try:
                if n_vars > 1:
                    delta_x = np.linalg.solve(J, -F)
                else:
                    val_j = J.item() if hasattr(J, "item") else J
                    if abs(val_j) < 1e-18:
                        raise ValueError("Derivada analítica nula o extremadamente cercana a cero.")
                    delta_x = np.array([-F[0] / val_j])
                
                if np.any(np.isnan(delta_x)) or np.any(np.isinf(delta_x)):
                    raise ValueError("El incremento calculado no es válido (Divergencia).")
            except np.linalg.LinAlgError:
                logger.error(f"Iteración {i+1}: Matriz Jacobiana singular.")
                return {
                    **resultado_base,
                    "error": "Matriz Jacobiana singular (determinante = 0). Intenta con otro punto inicial.", 
                    "tabla": {"cabecera": cabecera, "filas": filas}
                }
            except Exception as solve_err:
                logger.error(f"Iteración {i+1}: Error al resolver sistema -> {str(solve_err)}")
                return {
                    **resultado_base,
                    "error": f"Error al resolver el sistema en iteración {i+1}: {str(solve_err)}", 
                    "tabla": {"cabecera": cabecera, "filas": filas}
                }

            # 5. Calcular Errores y Validar Magnitud
            error_abs = np.linalg.norm(delta_x)
            nuevo_x = x + delta_x
            
            if np.any(np.abs(nuevo_x) > 1e100):
                logger.warning(f"Iteración {i+1}: Divergencia extrema detectada.")
                return {
                    **resultado_base,
                    "error": f"Divergencia extrema detectada en iteración {i+1}. Los valores superan el límite computacional.", 
                    "tabla": {"cabecera": cabecera, "filas": filas}
                }

            error_rel = error_abs / np.linalg.norm(nuevo_x) if np.linalg.norm(nuevo_x) > 0 else 0
            error_fun = np.linalg.norm(F)

            paso_detalle["delta_x"] = [round(float(v), 8) for v in delta_x]
            paso_detalle["nuevo_x"] = [round(float(v), 8) for v in nuevo_x]
            procedimiento_detallado.append(paso_detalle)
            
            # 6. Guardar en la tabla clásica
            fila_actual = [i + 1] 
            fila_actual += [round(float(v), 8) for v in x]
            fila_actual += [round(float(v), 8) for v in F]
            fila_actual += [round(float(error_abs), 10), round(float(error_rel), 10), round(float(error_fun), 10)]
            filas.append(fila_actual)
            
            # 7. Actualizar el punto
            x = nuevo_x
            
            if error_abs < tolerancia:
                convergio = True
                mensaje = "Convergencia analítica alcanzada con éxito."
                logger.info(f"Newton-Raphson convergió en {i+1} iteraciones.")
                break
                
        except Exception as e:
            logger.error(f"Error inesperado en ciclo iterativo de Newton: {str(e)}")
            return {
                **resultado_base,
                "error": f"Error crítico en iteración {i+1}: {str(e)}", 
                "tabla": {"cabecera": cabecera, "filas": filas}
            }

    # Análisis de tendencia si no convergió
    if not convergio:
        logger.warning(f"Newton-Raphson no convergió en {iteraciones} iteraciones.")
        if len(procedimiento_detallado) >= 2:
            e_n = filas[-1][-3] 
            e_prev = filas[-2][-3] if len(filas) >= 2 else e_n
            
            if e_n < e_prev:
                mensaje = f"Newton-Raphson no alcanzó la tolerancia en {iteraciones} iteraciones, pero el error disminuye. ¡Prueba aumentando las iteraciones!"
            elif e_n > e_prev * 1.1:
                mensaje = "El método está divergiendo. Esto suele ocurrir si el punto inicial está muy lejos de la raíz o cerca de un punto donde el Jacobiano es casi singular."
            else:
                mensaje = "El método presenta un comportamiento errático u oscilatorio."
        else:
            mensaje = "Se alcanzó el máximo de iteraciones. El punto inicial podría ser problemático."

    return {
        "raiz": [round(float(v), 10) for v in x],
        "convergio": convergio,
        "mensaje": mensaje,
        "formulas": formula_latex,
        "funciones_geogebra": funciones_geogebra,
        "tabla": {
            "cabecera": cabecera,
            "filas": filas
        },
        "procedimiento": procedimiento_detallado
    }
