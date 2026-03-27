import numpy as np
from helpers.calcular_jacobiano import calcular_jacobiano_analitico

def newton_method(funciones: list, punto_inicial: list, tolerancia: float, iteraciones: int):
    """
    Algoritmo de Newton-Raphson que utiliza el Jacobiano Analítico (SymPy).
    """
    n_vars = len(punto_inicial)
    
    # Definir automáticamente los nombres de las variables según el tamaño del punto
    # Si son 2 variables usamos ['x1', 'x2'] para ser consistentes con tu idea x_1, x_2
    variables_str = [f"x_{i+1}" for i in range(n_vars)]
    
    try:
        # Pre-calculamos las funciones y el Jacobiano analítico UNA SOLA VEZ
        f_eval, j_eval = calcular_jacobiano_analitico(funciones, variables_str)
    except Exception as e:
        return {"error": f"Error al parsear funciones: {str(e)}", "tabla": {"cabecera": [], "filas": []}}

    x = np.array(punto_inicial, dtype=float)
    
    # Cabeceras dinámicas
    cabecera = ["n"] + [f"x{i+1}" for i in range(n_vars)] + [f"f{i+1}" for i in range(len(funciones))] + ["Error"]
    filas = []
    convergio = False
    mensaje = "Se alcanzó el máximo de iteraciones sin converger."

    for i in range(iteraciones):
        try:
            # Evaluamos F y J en el punto actual x
            # *x desempaca el vector para pasarlo como argumentos individuales a la función lambdificada
            F = np.array(f_eval(*x), dtype=float).flatten()
            J = np.array(j_eval(*x), dtype=float)
            
            # Resolvemos J * delta_x = -F
            try:
                if n_vars > 1:
                    delta_x = np.linalg.solve(J, -F)
                else:
                    # En 1D, J es un escalar dentro de una matriz
                    val_j = J[0, 0] if J.ndim > 1 else J
                    if abs(val_j) < 1e-18:
                        raise ValueError("Derivada analítica cercana a cero.")
                    delta_x = np.array([-F[0] / val_j])
            except np.linalg.LinAlgError:
                return {"error": "Matriz Jacobiana singular.", "tabla": {"cabecera": cabecera, "filas": filas}}

            error = np.linalg.norm(delta_x)
            
            # Guardamos la fila
            fila_actual = [i + 1] 
            fila_actual += [round(float(v), 10) for v in x]
            fila_actual += [round(float(v), 10) for v in F]
            fila_actual += [round(float(error), 10)]
            filas.append(fila_actual)
            
            x = x + delta_x
            
            if error < tolerancia:
                convergio = True
                mensaje = "Convergencia analítica alcanzada con éxito."
                break
                
        except Exception as e:
            return {"error": f"Error en iteración {i+1}: {str(e)}", "tabla": {"cabecera": cabecera, "filas": filas}}

    return {
        "raiz": [round(float(v), 10) for v in x],
        "convergio": convergio,
        "mensaje": mensaje,
        "tabla": {"cabecera": cabecera, "filas": filas}
    }
