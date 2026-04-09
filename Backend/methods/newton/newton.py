import numpy as np
from helpers.calcular_jacobiano import calcular_jacobiano_analitico

def newton_method(funciones: list, punto_inicial: list, tolerancia: float, iteraciones: int):
    """
    Algoritmo de Newton-Raphson con soporte de procedimiento detallado para la UI.
    """
    n_vars = len(punto_inicial)
    variables_str = [f"x_{i+1}" for i in range(n_vars)]
    
    try:
        # 1. Obtener funciones y Jacobiano analítico con sus versiones en LaTeX
        res_jac = calcular_jacobiano_analitico(funciones, variables_str)
        f_eval, j_eval = res_jac["f_eval"], res_jac["j_eval"]
        formula_latex = res_jac["latex"]
    except Exception as e:
        return {"error": f"Error en el Parser: {str(e)}", "tabla": {"cabecera": [], "filas": []}}

    x = np.array(punto_inicial, dtype=float)
    
    # Datos para la tabla clásica y para el procedimiento detallado
    cabecera = [
        "n", 
        *[f"x_{i+1}" for i in range(n_vars)], 
        *[f"f_{i+1}" for i in range(len(funciones))], 
        "||x_{k+1}-x_k||", 
        "\\frac{||x_{k+1}-x_k||}{||x_{k+1}||}", 
        "||f(x_k)||"
    ]
    filas = []
    procedimiento_detallado = []
    convergio = False
    mensaje = "Se alcanzó el máximo de iteraciones sin converger."

    for i in range(iteraciones):
        try:
            # 2. Evaluación de F y J en el punto actual
            F = np.array(f_eval(*x), dtype=float).flatten()
            J = np.array(j_eval(*x), dtype=float)
            
            # 3. Guardamos los detalles intermedios para la UI antes de resolver
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
                        raise ValueError("Derivada analítica nula.")
                    delta_x = np.array([-F[0] / val_j])
            except np.linalg.LinAlgError:
                return {"error": "Matriz Jacobiana singular (det=0).", "tabla": {"cabecera": cabecera, "filas": filas}}

            # 5. Calcular Errores
            error_abs = np.linalg.norm(delta_x)
            nuevo_x = x + delta_x
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
                break
                
        except Exception as e:
            return {"error": f"Error en iteración {i+1}: {str(e)}", "tabla": {"cabecera": cabecera, "filas": filas}}

    # 8. Generación de datos para GeoGebra (Strings limpios y con multiplicación explícita)
    from helpers.parser_matematico import pre_procesar_implicit_mult
    funciones_geogebra = []
    for f_s in funciones:
        # 1. Insertamos asteriscos automáticos (xy -> x*y)
        f_limpia = pre_procesar_implicit_mult(f_s)
        # 2. Traducimos variables técnicas a geométricas
        f_g = f_limpia.replace("x_1", "x").replace("x_2", "y").replace("x_3", "z")
        funciones_geogebra.append(f_g)

    # 9. Generación de datos para gráficas (Solo para 1D y 2D por ahora)
    datos_grafica = []
    # ... (mantenemos la lógica de datos_grafica por si acaso, pero priorizaremos funciones_geogebra)

    # 10. Devolvemos la respuesta enriquecida
    return {
        "raiz": [round(float(v), 10) for v in x],
        "convergio": convergio,
        "mensaje": mensaje,
        "formulas": formula_latex,
        "funciones_geogebra": funciones_geogebra, # Nuevo campo
        "tabla": {
            "cabecera": cabecera,
            "filas": filas
        },
        "procedimiento": procedimiento_detallado,
        "datos_grafica": datos_grafica
    }
