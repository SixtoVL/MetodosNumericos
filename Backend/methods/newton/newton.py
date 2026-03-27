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
    cabecera = ["n"] + [f"x_{i+1}" for i in range(n_vars)] + [f"f_{i+1}" for i in range(len(funciones))] + ["Error"]
    filas = []
    procedimiento_detallado = [] # Nuevo campo para mostrar los cálculos paso a paso
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

            # 5. Calcular Error y actualizar paso detallado con el resultado de delta_x
            error = np.linalg.norm(delta_x)
            paso_detalle["delta_x"] = [round(float(v), 8) for v in delta_x]
            paso_detalle["nuevo_x"] = [round(float(v+dv), 8) for v, dv in zip(x, delta_x)]
            procedimiento_detallado.append(paso_detalle)
            
            # 6. Guardar en la tabla clásica
            fila_actual = [i + 1] 
            fila_actual += [round(float(v), 8) for v in x]
            fila_actual += [round(float(v), 8) for v in F]
            fila_actual += [round(float(error), 8)]
            filas.append(fila_actual)
            
            # 7. Actualizar el punto
            x = x + delta_x
            
            if error < tolerancia:
                convergio = True
                mensaje = "Convergencia analítica alcanzada con éxito."
                break
                
        except Exception as e:
            return {"error": f"Error en iteración {i+1}: {str(e)}", "tabla": {"cabecera": cabecera, "filas": filas}}

    # 8. Devolvemos la respuesta enriquecida
    return {
        "raiz": [round(float(v), 10) for v in x],
        "convergio": convergio,
        "mensaje": mensaje,
        "formulas": formula_latex, # Fórmulas en LaTeX
        "tabla": {
            "cabecera": cabecera,
            "filas": filas
        },
        "procedimiento": procedimiento_detallado # Detalles paso a paso para la UI
    }
