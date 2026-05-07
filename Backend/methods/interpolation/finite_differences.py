import numpy as np
import math

def finite_differences_method(puntos):
    """
    Calcula la tabla de diferencias finitas (hacia adelante) y el procedimiento paso a paso.
    Asume que los puntos ya han sido validados como equiespaciados.
    """
    n = len(puntos)
    x = np.array([p.x for p in puntos], dtype=float)
    y = np.array([p.y for p in puntos], dtype=float)
    h = x[1] - x[0]
    
    # Tabla de diferencias (no divididas, solo restas)
    tabla = np.zeros((n, n))
    tabla[:, 0] = y
    
    pasos = []
    
    for j in range(1, n):
        for i in range(n - j):
            resultado = tabla[i+1, j-1] - tabla[i, j-1]
            tabla[i, j] = resultado
            
            delta_str = f"\\Delta^{j} y_{i}"
            
            formula = f"{delta_str} = {tabla[i+1, j-1]:.4g} - ({tabla[i, j-1]:.4g}) = {resultado:.4g}"
            
            pasos.append({
                "orden": j,
                "descripcion": f"Cálculo de diferencia de orden {j}",
                "formula": formula
            })
            
    # Coeficientes para el polinomio de Newton (hacia adelante)
    # f[x0...xk] = D^k_y0 / (k! * h^k)
    coefs_divididas = []
    for k in range(n):
        diff_finita = tabla[0, k]
        factorial_k = math.factorial(k)
        denominador = factorial_k * (h ** k)
        coefs_divididas.append(diff_finita / denominador)

    # Construir la expresión del polinomio en formato LaTeX
    terminos_latex = [f"{coefs_divididas[0]:.4g}"]
    for i in range(1, n):
        coef = coefs_divididas[i]
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
    
    # Formatear la tabla para la respuesta
    tabla_completa = []
    for i in range(n):
        fila = [float(x[i])] + [float(v) for v in tabla[i, : (n - i)]]
        while len(fila) < n + 1:
            fila.append(None)
        tabla_completa.append(fila)
        
    return {
        "coeficientes": coefs_divididas, # Devolvemos los equivalentes a divididas para que la evaluación funcione igual
        "tabla": tabla_completa,
        "pasos": pasos,
        "polinomio_latex": f"P(x) = {polinomio_latex}",
        "puntos_x": x.tolist(),
        "puntos_y": y.tolist()
    }
