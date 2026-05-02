import numpy as np

def divided_differences_method(puntos):
    """
    Calcula la tabla de diferencias divididas (versión estándar) y el procedimiento paso a paso.
    """
    n = len(puntos)
    x = np.array([p.x for p in puntos], dtype=float)
    y = np.array([p.y for p in puntos], dtype=float)
    
    # Crear la tabla de diferencias (matriz n x n)
    # Rellenamos con ceros. La primera columna son las y.
    tabla = np.zeros((n, n))
    tabla[:, 0] = y
    
    pasos = []
    
    # Calcular las diferencias divididas (forma clásica)
    for j in range(1, n):
        for i in range(n - j):
            numerador = tabla[i+1, j-1] - tabla[i, j-1]
            denominador = x[i+j] - x[i]
            resultado = numerador / denominador
            tabla[i, j] = resultado
            
            # Formatear el paso en LaTeX
            indices = [f"x_{k+i}" for k in range(j+1)]
            f_str = f"f[{', '.join(indices)}]"
            
            # Usamos doble llave para escapar las llaves literales de LaTeX en el f-string
            formula = (
                f"{f_str} = \\frac{{{tabla[i+1, j-1]:.4g} - ({tabla[i, j-1]:.4g})}}"
                f"{{{x[i+j]:.4g} - ({x[i]:.4g})}} = {resultado:.4g}"
            )
            
            pasos.append({
                "orden": j,
                "descripcion": f"Cálculo de {f_str}",
                "formula": formula
            })
            
    # Los coeficientes del polinomio son la primera fila de la tabla
    coeficientes = tabla[0, :].tolist()
    
    # Construir la expresión del polinomio en formato LaTeX
    terminos_latex = [f"{coeficientes[0]:.4g}"]
    for i in range(1, n):
        coef = coeficientes[i]
        if abs(coef) < 1e-10:
            continue
            
        signo = "+" if coef >= 0 else "-"
        valor = abs(coef)
        
        factor = ""
        for k in range(i):
            val_x = x[k]
            signo_x = "-" if val_x >= 0 else "+"
            factor += f"(x {signo_x} {abs(val_x):.4g})"
            
        terminos_latex.append(f"{signo} {valor:.4g}{factor}")
    
    polinomio_latex = " ".join(terminos_latex)
    
    # Formatear la tabla para la respuesta (triangular superior)
    tabla_completa = []
    for i in range(n):
        # x_i + diferencias de esa fila (solo las calculadas)
        fila = [float(x[i])] + [float(v) for v in tabla[i, : (n - i)]]
        # Rellenar con nulls el resto para mantener la forma de matriz si es necesario
        while len(fila) < n + 1:
            fila.append(None)
        tabla_completa.append(fila)
        
    return {
        "coeficientes": coeficientes,
        "tabla": tabla_completa,
        "pasos": pasos,
        "polinomio_latex": f"P(x) = {polinomio_latex}",
        "puntos_x": x.tolist(),
        "puntos_y": y.tolist()
    }
