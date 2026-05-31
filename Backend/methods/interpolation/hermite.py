import numpy as np
import sympy
from math import factorial
from methods.interpolation.helpers.polynomial_utils import calculate_reduced_polynomial

def hermite_method(puntos_hermite):
    """
    Implementa la interpolación de Hermite generalizada.
    Cada punto en puntos_hermite tiene x, y, y una lista opcional de derivadas [f'(x), f''(x), ...].
    """
    # 1. Preparación de nodos expandidos (z) y sus valores asociados
    z = []
    f_z_inicial = [] # Los f[z_i] iniciales (todos son f(x))
    # Mapa para guardar las derivadas de cada punto para el llenado de la tabla
    # clave: (x_valor, orden) -> valor de f^(orden)(x)
    mapa_derivadas = {}

    for p in puntos_hermite:
        m = len(p.derivadas) if p.derivadas else 0
        # El punto x se repite m+1 veces
        for _ in range(m + 1):
            z.append(p.x)
            f_z_inicial.append(p.y)
        
        # Guardar f(x) como derivada de orden 0
        mapa_derivadas[(p.x, 0)] = p.y
        if p.derivadas:
            for orden, val_der in enumerate(p.derivadas, 1):
                mapa_derivadas[(p.x, orden)] = val_der

    n = len(z)
    z = np.array(z)
    
    # 2. Construcción de la tabla de diferencias divididas
    tabla = np.zeros((n, n))
    tabla[:, 0] = f_z_inicial
    pasos = []

    # Llenado de la tabla por órdenes
    for j in range(1, n):
        for i in range(n - j):
            # Si todos los nodos involucrados son el mismo x
            if z[i] == z[i+j]:
                # Usamos la fórmula de Hermite: f[z_i, ..., z_{i+j}] = f^(j)(z[i]) / j!
                valor_der = mapa_derivadas.get((z[i], j))
                if valor_der is None:
                    # Esto no debería pasar si los datos están bien, pero por seguridad:
                    tabla[i, j] = 0 
                else:
                    tabla[i, j] = valor_der / factorial(j)
                
                orden_texto = f"f^{{({j})}}({z[i]})" if j > 1 else f"f'({z[i]})"
                divisor = f"{j}!" if j > 1 else "1"
                formula = f"f[z_{{{i}}}, \\dots, z_{{{i+j}}}] = \\frac{{{orden_texto}}}{{{divisor}}} = {tabla[i, j]:.4g}"
                desc = f"Información de la derivada de orden {j} en x = {z[i]}"
            else:
                # Nodos distintos: diferencia dividida estándar
                numerador = tabla[i+1, j-1] - tabla[i, j-1]
                denominador = z[i+j] - z[i]
                tabla[i, j] = numerador / denominador
                
                formula = f"f[z_{{{i}}}, \\dots, z_{{{i+j}}}] = \\frac{{{tabla[i+1, j-1]:.4g} - ({tabla[i, j-1]:.4g})}}{{{z[i+j]:.4g} - ({z[i]:.4g})}} = {tabla[i, j]:.4g}"
                desc = f"Diferencia dividida de orden {j}"

            pasos.append({
                "orden": j,
                "descripcion": desc,
                "formula": formula
            })

    # 3. Construcción del Polinomio (Forma de Newton)
    coefs = tabla[0, :]
    terminos_latex = [f"{coefs[0]:.4g}"]
    
    for i in range(1, n):
        coef = coefs[i]
        if abs(coef) < 1e-12: continue
        
        signo = "+" if coef >= 0 else "-"
        valor = abs(coef)
        
        # Construir factores (x - z0)(x - z1)...
        factores = ""
        for k in range(i):
            val_z = z[k]
            if val_z == 0:
                factores += "x"
            else:
                signo_z = "-" if val_z >= 0 else "+"
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
        "puntos_x": list(dict.fromkeys([p.x for p in puntos_hermite])), # x únicos
        "puntos_y": [p.y for p in puntos_hermite]
    }
