import numpy as np
import sympy as sp

def least_squares_method(puntos, grado=1):
    """
    Calcula la aproximación por mínimos cuadrados para un grado dado (1: lineal, 2: cuadrático).
    """
    n = len(puntos)
    x_vals = np.array([p.x for p in puntos], dtype=float)
    y_vals = np.array([p.y for p in puntos], dtype=float)
    
    # 1. Calcular sumatorias necesarias
    # Para grado m, necesitamos sumatorias de x^k hasta k = 2*m
    # y sumatorias de x^k * y hasta k = m
    max_pow_x = 2 * grado
    max_pow_xy = grado
    
    sum_x = {k: np.sum(x_vals**k) for k in range(max_pow_x + 1)}
    sum_xy = {k: np.sum((x_vals**k) * y_vals) for k in range(max_pow_xy + 1)}
    
    # 2. Construir el sistema de ecuaciones normales (Matriz A y vector B)
    # A * coefs = B
    matrix_a = np.zeros((grado + 1, grado + 1))
    vector_b = np.zeros(grado + 1)
    
    for i in range(grado + 1):
        for j in range(grado + 1):
            matrix_a[i, j] = sum_x[i + j]
        vector_b[i] = sum_xy[i]
        
    # Resolver el sistema
    coefs = np.linalg.solve(matrix_a, vector_b)
    
    # 3. Construir el procedimiento paso a paso
    pasos = []
    
    # Tabla de sumatorias
    columnas = ["x", "y"]
    for k in range(2, max_pow_x + 1):
        columnas.append(f"x^{{{k}}}")
    for k in range(1, max_pow_xy + 1):
        columnas.append(f"x^{{{k}}}y")
        
    filas_tabla = []
    for i in range(n):
        fila = [float(x_vals[i]), float(y_vals[i])]
        # x^2, x^3, ...
        for k in range(2, max_pow_x + 1):
            fila.append(float(x_vals[i]**k))
        # xy, x^2y, ...
        for k in range(1, max_pow_xy + 1):
            fila.append(float((x_vals[i]**k) * y_vals[i]))
        filas_tabla.append(fila)
        
    # Fila de totales
    fila_totales = [float(sum_x[1]), float(sum_xy[0])] # sum x, sum y
    for k in range(2, max_pow_x + 1):
        fila_totales.append(float(sum_x[k]))
    for k in range(1, max_pow_xy + 1):
        fila_totales.append(float(sum_xy[k]))
        
    pasos.append({
        "tipo": "tabla",
        "descripcion": f"Cálculo de sumatorias (N={n})",
        "columnas": columnas,
        "filas": filas_tabla,
        "totales": fila_totales
    })
    
    # Sistema de ecuaciones
    ecuaciones_latex = []
    for i in range(grado + 1):
        terminos = []
        for j in range(grado + 1):
            coef_val = matrix_a[i, j]
            terminos.append(f"{coef_val:.4g} a_{j}")
        ecuaciones_latex.append(" + ".join(terminos) + f" = {vector_b[i]:.4g}")
        
    pasos.append({
        "tipo": "sistema",
        "descripcion": "Sistema de ecuaciones normales",
        "formula": "\\begin{cases} " + " \\\\ ".join(ecuaciones_latex) + " \\end{cases}"
    })
    
    # Coeficientes resultantes
    coefs_str = ", ".join([f"a_{i} = {val:.6g}" for i, val in enumerate(coefs)])
    pasos.append({
        "tipo": "resultado",
        "descripcion": "Coeficientes calculados",
        "formula": coefs_str
    })
    
    # 4. Construir polinomio
    x_sym = sp.Symbol('x')
    poly_expr = 0
    terminos_poly_latex = []
    
    # Invertir orden para que sea a_m x^m + ... + a_0
    for i in range(grado, -1, -1):
        c = coefs[i]
        poly_expr += c * (x_sym**i)
        
        if abs(c) < 1e-10: continue
        
        signo = "+" if c >= 0 and i < grado else ""
        if c < 0: signo = "-"
        
        val = abs(c)
        if i == 0:
            term = f"{val:.4g}"
        elif i == 1:
            term = f"{val:.4g}x"
        else:
            term = f"{val:.4g}x^{{{i}}}"
            
        terminos_poly_latex.append(f"{signo} {term}")
        
    polinomio_latex = " ".join(terminos_poly_latex)
    
    # Error estándar y R^2
    y_pred = np.polyval(coefs[::-1], x_vals)
    ss_res = np.sum((y_vals - y_pred)**2)
    ss_tot = np.sum((y_vals - np.mean(y_vals))**2)
    r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 1.0
    
    return {
        "coeficientes": coefs.tolist(),
        "pasos": pasos,
        "polinomio_latex": f"f(x) = {polinomio_latex}",
        "r_squared": float(r_squared),
        "puntos_x": x_vals.tolist(),
        "puntos_y": y_vals.tolist(),
        "y_pred": y_pred.tolist(),
        "poly_expr": poly_expr
    }
