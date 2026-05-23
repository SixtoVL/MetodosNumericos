import numpy as np
import math
from methods.interpolation.helpers.polynomial_utils import calculate_reduced_polynomial

def finite_differences_method(puntos, direccion="adelante", x_a_evaluar=None, pivote=0):
    """
    Calcula la tabla de diferencias finitas y el procedimiento paso a paso.
    Maneja tanto Newton hacia Adelante como Newton hacia Atrás permitiendo un pivote.
    """
    n = len(puntos)
    x_vals = np.array([p.x for p in puntos], dtype=float)
    y_vals = np.array([p.y for p in puntos], dtype=float)
    h = x_vals[1] - x_vals[0]
    
    # Validar pivote
    if pivote < 0 or pivote >= n:
        pivote = 0 if direccion == "adelante" else n - 1

    # Tabla de diferencias (no divididas, solo restas)
    tabla = np.zeros((n, n))
    tabla[:, 0] = y_vals
    
    pasos = []
    
    # --- PASO 1: CÁLCULO DE H ---
    pasos.append({
        "orden": 0,
        "descripcion": "Cálculo del tamaño del paso (h)",
        "formula": f"h = x_1 - x_0 = {x_vals[1]:.4g} - {x_vals[0]:.4g} = {h:.4g}"
    })

    # --- PASO 2: CÁLCULO DE S ---
    s = None
    x_ref = x_vals[pivote]
    simbolo_ref = f"x_{{{pivote}}}"
    
    if x_a_evaluar is not None:
        s = (x_a_evaluar - x_ref) / h
        formula_s = f"s = \\frac{{x - {simbolo_ref}}}{{h}} = \\frac{{{x_a_evaluar:.4g} - {x_ref:.4g}}}{{{h:.4g}}} = {s:.4g}"
        descripcion_s = (
            f"Cálculo de 's' (posición relativa): Indica que el valor x = {x_a_evaluar:.4g} "
            f"se encuentra a {s:.4g} intervalos de distancia (pasos de tamaño h) desde el pivote {simbolo_ref}."
        )
    else:
        formula_s = f"s = \\frac{{x - {simbolo_ref}}}{{h}} = \\frac{{x - {x_ref:.4g}}}{{{h:.4g}}}"
        descripcion_s = (
            f"Definición de 's': Parámetro adimensional que indica la posición relativa de x "
            f"respecto al punto de referencia {simbolo_ref}, medida en unidades del espaciamiento h."
        )

    pasos.append({
        "orden": 0,
        "descripcion": descripcion_s,
        "formula": formula_s
    })

    # --- PASO 3: TABLA DE DIFERENCIAS ---
    for j in range(1, n):
        for i in range(n - j):
            resultado = tabla[i+1, j-1] - tabla[i, j-1]
            tabla[i, j] = resultado
            
            # Formatear el paso según la dirección
            if direccion == "adelante":
                simbolo = f"\\Delta^{{{j}}} y_{{{i}}}"
                desc = f"Cálculo de diferencia hacia adelante de orden {j}"
            else:
                # Para atrás, la Delta i es equivalente a la Nabla i+j
                simbolo = f"\\nabla^{{{j}}} y_{{{i+j}}}"
                desc = f"Cálculo de diferencia hacia atrás de orden {j}"
            
            formula = f"{simbolo} = {tabla[i+1, j-1]:.4g} - ({tabla[i, j-1]:.4g}) = {resultado:.4g}"
            
            pasos.append({
                "orden": j,
                "descripcion": desc,
                "formula": formula
            })
            
    # Selección de coeficientes y construcción del polinomio
    coefs_simplificados = [] # Estos son Dy/k! o Ny/k!
    
    if direccion == "adelante":
        max_k = n - pivote
        x_newton = x_vals[pivote:].tolist()
        
        # Explicar la selección de la diagonal
        pasos.append({
            "orden": n + 1,
            "descripcion": "Selección de coeficientes (Diagonal Descendente)",
            "formula": f"\\text{{Coeficientes: }} \\Delta^k y_{{{pivote}}} \\text{{ partiendo de }} y_{{{pivote}}}"
        })

        for k in range(max_k):
            diff_finita = tabla[pivote, k]
            factorial_k = math.factorial(k)
            coefs_simplificados.append(diff_finita / factorial_k)
            
        terminos_latex = [f"{coefs_simplificados[0]:.4g}"]
        for i in range(1, len(coefs_simplificados)):
            coef = coefs_simplificados[i]
            if abs(coef) < 1e-10: continue
            signo = "+" if coef >= 0 else "-"
            valor = abs(coef)
            factor_s = "s"
            for k in range(1, i):
                factor_s += f"(s - {k})"
            terminos_latex.append(f"{signo} {valor:.4g}{factor_s}")
            
    else:
        # Newton Atrás desde el pivote: usa tabla[pivote-k, k]
        max_k = pivote + 1
        x_newton = x_vals[:pivote+1][::-1].tolist()

        # Explicar la selección de la diagonal
        pasos.append({
            "orden": n + 1,
            "descripcion": "Selección de coeficientes (Diagonal Ascendente)",
            "formula": f"\\text{{Coeficientes: }} \\nabla^k y_{{{pivote}}} \\text{{ terminando en }} y_{{{pivote}}}"
        })
        
        for k in range(max_k):
            # En nuestra tabla de diferencias finitas, la nabla^k y_p es tabla[p-k, k]
            diff_finita = tabla[pivote - k, k] 
            factorial_k = math.factorial(k)
            coefs_simplificados.append(diff_finita / factorial_k)
            
        terminos_latex = [f"{coefs_simplificados[0]:.4g}"]
        for i in range(1, len(coefs_simplificados)):
            coef = coefs_simplificados[i]
            if abs(coef) < 1e-10: continue
            signo = "+" if coef >= 0 else "-"
            valor = abs(coef)
            factor_s = "s"
            for k in range(1, i):
                factor_s += f"(s + {k})"
            terminos_latex.append(f"{signo} {valor:.4g}{factor_s}")

    polinomio_latex = " ".join(terminos_latex)
    
    # Coeficientes equivalentes para el polinomio reducido
    # f[x0...xk] = D^k y0 / (k! * h^k) para adelante
    # f[xn...xn-k] = N^k yn / (k! * h^k) para atrás
    coefs_newton_equivalentes = [coefs_simplificados[k] / (h**k) for k in range(len(coefs_simplificados))]
    polinomio_reducido_latex = calculate_reduced_polynomial(coefs_newton_equivalentes, x_newton)
    
    # Formatear la tabla para la respuesta
    tabla_completa = []
    for i in range(n):
        fila = [float(x_vals[i])] + [float(v) for v in tabla[i, : (n - i)]]
        while len(fila) < n + 1:
            fila.append(None)
        tabla_completa.append(fila)
        
    return {
        "coeficientes": coefs_newton_equivalentes,
        "tabla": tabla_completa,
        "pasos": pasos,
        "polinomio_latex": f"P(s) = {polinomio_latex}",
        "polinomio_reducido_latex": f"P(x) = {polinomio_reducido_latex}",
        "puntos_x": x_vals.tolist(),
        "puntos_y": y_vals.tolist(),
        "nodos_x": x_newton,
        "s": s,
        "pivote_usado": pivote
    }
