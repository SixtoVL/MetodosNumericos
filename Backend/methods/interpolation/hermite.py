import numpy as np
import sympy
from methods.interpolation.helpers.polynomial_utils import calculate_reduced_polynomial

def hermite_method(puntos_hermite):
    """
    Implementa la interpolación de Hermite usando diferencias divididas con nodos duplicados.
    Cada punto en puntos_hermite tiene x, y, dy (derivada).
    """
    n_original = len(puntos_hermite)
    n = 2 * n_original
    
    # 1. Preparación de nodos duplicados (z) y valores f(z)
    z = np.zeros(n)
    f_z = np.zeros(n)
    derivadas = np.zeros(n_original)
    
    for i in range(n_original):
        z[2*i] = puntos_hermite[i].x
        z[2*i+1] = puntos_hermite[i].x
        f_z[2*i] = puntos_hermite[i].y
        f_z[2*i+1] = puntos_hermite[i].y
        derivadas[i] = puntos_hermite[i].dy

    # 2. Construcción de la tabla de diferencias divididas
    tabla = np.zeros((n, n))
    tabla[:, 0] = f_z
    pasos = []

    # Orden 1: Manejo especial para nodos duplicados
    for i in range(n - 1):
        if i % 2 == 0:
            # Nodos duplicados: usamos la derivada f'(x)
            tabla[i, 1] = derivadas[i // 2]
            formula = f"f[z_{{{i}}}, z_{{{i+1}}}] = f'(x_{{{i//2}}}) = {tabla[i, 1]:.4g}"
            desc = f"Derivada en x = {z[i]}"
        else:
            # Nodos distintos: diferencia normal
            numerador = tabla[i+1, 0] - tabla[i, 0]
            denominador = z[i+1] - z[i]
            tabla[i, 1] = numerador / denominador
            formula = f"f[z_{{{i}}}, z_{{{i+1}}}] = \\frac{{{tabla[i+1, 0]:.4g} - {tabla[i, 0]:.4g}}}{{{z[i+1]:.4g} - {z[i]:.4g}}} = {tabla[i, 1]:.4g}"
            desc = f"Diferencia entre nodos distintos"

        pasos.append({
            "orden": 1,
            "descripcion": desc,
            "formula": formula
        })

    # Ordenes superiores: Newton normal
    for j in range(2, n):
        for i in range(n - j):
            numerador = tabla[i+1, j-1] - tabla[i, j-1]
            denominador = z[i+j] - z[i]
            tabla[i, j] = numerador / denominador
            
            pasos.append({
                "orden": j,
                "descripcion": f"Diferencia dividida de orden {j}",
                "formula": f"f[z_{{{i}}}, \\dots, z_{{{i+j}}}] = \\frac{{{tabla[i+1, j-1]:.4g} - ({tabla[i, j-1]:.4g})}}{{{z[i+j]:.4g} - {z[i]:.4g}}} = {tabla[i, j]:.4g}"
            })

    # 3. Construcción del Polinomio (Forma de Newton)
    coefs = tabla[0, :]
    terminos_latex = [f"{coefs[0]:.4g}"]
    
    for i in range(1, n):
        coef = coefs[i]
        if abs(coef) < 1e-10: continue
        
        signo = "+" if coef >= 0 else "-"
        valor = abs(coef)
        
        # Construir factores (x - z0)(x - z1)...
        factores = ""
        for k in range(i):
            val_z = z[k]
            if val_z == 0:
                factores += "x"
            else:
                signo_z = "-" if val_z > 0 else "+"
                factores += f"(x {signo_z} {abs(val_z):.4g})"
        
        terminos_latex.append(f"{signo} {valor:.4g}{factores}")

    polinomio_latex = " ".join(terminos_latex)

    # 4. Polinomio Reducido
    polinomio_reducido_latex = calculate_reduced_polynomial(coefs.tolist(), z.tolist())

    # Formatear tabla para respuesta
    tabla_completa = []
    for i in range(n):
        fila = [float(z[i])] + [float(v) for v in tabla[i, : (n - i)]]
        while len(fila) < n + 1:
            fila.append(None)
        tabla_completa.append(fila)

    return {
        "coeficientes": coefs.tolist(),
        "tabla": tabla_completa,
        "pasos": pasos,
        "polinomio_latex": f"P(x) = {polinomio_latex}",
        "polinomio_reducido_latex": f"P(x) = {polinomio_reducido_latex}",
        "nodos_z": z.tolist(),
        "puntos_x": [p.x for p in puntos_hermite],
        "puntos_y": [p.y for p in puntos_hermite]
    }
