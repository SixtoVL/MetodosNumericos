import numpy as np
import math

def finite_differences_method(puntos, direccion="adelante"):
    """
    Calcula la tabla de diferencias finitas y el procedimiento paso a paso.
    Maneja tanto Newton hacia Adelante como Newton hacia Atrás.
    """
    n = len(puntos)
    x = np.array([p.x for p in puntos], dtype=float)
    y = np.array([p.y for p in puntos], dtype=float)
    h = x[1] - x[0]
    
    # Tabla de diferencias (no divididas, solo restas)
    # tabla[i, j] guardará la diferencia de orden j que empieza en el índice i
    tabla = np.zeros((n, n))
    tabla[:, 0] = y
    
    pasos = []
    
    # Calcular la tabla de diferencias (la misma para adelante y atrás)
    for j in range(1, n):
        for i in range(n - j):
            resultado = tabla[i+1, j-1] - tabla[i, j-1]
            tabla[i, j] = resultado
            
            # Usar notación Delta (Adelante) o Nabla (Atrás) según corresponda para los pasos
            simbolo = "\\Delta" if direccion == "adelante" else "\\nabla"
            subindice = i if direccion == "adelante" else i+j
            
            formula = f"{simbolo}^{{{j}}} y_{{{subindice}}} = {tabla[i+1, j-1]:.4g} - ({tabla[i, j-1]:.4g}) = {resultado:.4g}"
            
            pasos.append({
                "orden": j,
                "descripcion": f"Cálculo de diferencia de orden {j}",
                "formula": formula
            })
            
    # Selección de coeficientes y construcción del polinomio
    coefs_divididas = []
    
    if direccion == "adelante":
        # Newton Adelante usa la diagonal superior: tabla[0, k]
        for k in range(n):
            diff_finita = tabla[0, k]
            factorial_k = math.factorial(k)
            denominador = factorial_k * (h ** k)
            coefs_divididas.append(diff_finita / denominador)
            
        # P(x) = y0 + f[x0,x1](x-x0) + f[x0,x1,x2](x-x0)(x-x1) + ...
        terminos_latex = [f"{coefs_divididas[0]:.4g}"]
        for i in range(1, n):
            coef = coefs_divididas[i]
            if abs(coef) < 1e-10: continue
            signo = "+" if coef >= 0 else "-"
            valor = abs(coef)
            factor = "".join([f"(x {'-' if x[k]>=0 else '+'} {abs(x[k]):.4g})" for k in range(i)])
            terminos_latex.append(f"{signo} {valor:.4g}{factor}")
            
    else:
        # Newton Atrás usa la diagonal inferior: tabla[n-k-1, k]
        # Nota: f[xn, xn-1, ..., xn-k] = Nabla^k yn / (k! * h^k)
        for k in range(n):
            diff_finita = tabla[n-k-1, k] # Última diferencia calculada en cada columna
            factorial_k = math.factorial(k)
            denominador = factorial_k * (h ** k)
            coefs_divididas.append(diff_finita / denominador)
            
        # P(x) = yn + f[xn, xn-1](x-xn) + f[xn, xn-1, xn-2](x-xn)(x-xn-1) + ...
        terminos_latex = [f"{coefs_divididas[0]:.4g}"]
        for i in range(1, n):
            coef = coefs_divididas[i]
            if abs(coef) < 1e-10: continue
            signo = "+" if coef >= 0 else "-"
            valor = abs(coef)
            # Factores son (x-xn), (x-xn)(x-xn-1), etc.
            factor = "".join([f"(x {'-' if x[n-1-k]>=0 else '+'} {abs(x[n-1-k]):.4g})" for k in range(i)])
            terminos_latex.append(f"{signo} {valor:.4g}{factor}")

    polinomio_latex = " ".join(terminos_latex)
    
    # Formatear la tabla para la respuesta (triangular superior)
    tabla_completa = []
    for i in range(n):
        fila = [float(x[i])] + [float(v) for v in tabla[i, : (n - i)]]
        while len(fila) < n + 1:
            fila.append(None)
        tabla_completa.append(fila)
        
    return {
        "coeficientes": coefs_divididas,
        "tabla": tabla_completa,
        "pasos": pasos,
        "polinomio_latex": f"P(x) = {polinomio_latex}",
        "puntos_x": x.tolist(),
        "puntos_y": y.tolist()
    }
