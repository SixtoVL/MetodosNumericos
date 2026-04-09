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

    # 8. Generación de datos para gráficas (Solo para 1D y 2D por ahora)
    datos_grafica = []
    try:
        if n_vars == 1:
            # Generamos un rango inteligente basado en el punto inicial o la raíz
            r = x[0]
            # Tomamos un rango de ±3 unidades para ver bien la curva
            x_vals = np.linspace(r - 3, r + 3, 300)
            # Evaluamos la función en ese rango
            y_vals = []
            for xv in x_vals:
                try:
                    res = float(f_eval(xv))
                    # Evitar valores infinitos o extremadamente grandes para Plotly
                    if abs(res) > 1e10: y_vals.append(None)
                    else: y_vals.append(res)
                except:
                    y_vals.append(None)
                    
            datos_grafica.append({
                "type": "function_1d",
                "x": x_vals.tolist(),
                "y": y_vals,
                "name": "f(x)"
            })
        elif n_vars == 2:
            # Para 2D generamos curvas de nivel f(x,y)=0
            r1, r2 = x[0], x[1]
            grid_size = 50
            x1_range = np.linspace(r1 - 2.5, r1 + 2.5, grid_size)
            x2_range = np.linspace(r2 - 2.5, r2 + 2.5, grid_size)
            X1, X2 = np.meshgrid(x1_range, x2_range)
            
            # Evaluamos cada función del sistema
            for idx, f_s in enumerate(funciones):
                Z = np.zeros((grid_size, grid_size))
                for i in range(grid_size):
                    for j in range(grid_size):
                        try:
                            val = f_eval(X1[i,j], X2[i,j])
                            Z[i,j] = float(val[idx])
                        except:
                            Z[i,j] = np.nan
                
                datos_grafica.append({
                    "type": "contour_2d",
                    "x": x1_range.tolist(),
                    "y": x2_range.tolist(),
                    "z": Z.tolist(),
                    "name": f"f_{idx+1}(x,y) = 0"
                })
    except Exception as e:
        print(f"DEBUG: Error al generar datos de gráfica: {str(e)}")
        pass

    # 9. Devolvemos la respuesta enriquecida
    return {
        "raiz": [round(float(v), 10) for v in x],
        "convergio": convergio,
        "mensaje": mensaje,
        "formulas": formula_latex,
        "tabla": {
            "cabecera": cabecera,
            "filas": filas
        },
        "procedimiento": procedimiento_detallado,
        "datos_grafica": datos_grafica
    }
