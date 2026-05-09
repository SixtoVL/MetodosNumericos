import sympy

def calculate_reduced_polynomial(coeficientes, x_vals):
    """
    Calcula la forma reducida (expandida) de un polinomio de Newton
    dados sus coeficientes y los puntos x_i.
    """
    n = len(coeficientes)
    x_sym = sympy.Symbol('x')
    poly_sym = coeficientes[0]
    
    for i in range(1, n):
        term = coeficientes[i]
        for k in range(i):
            term *= (x_sym - x_vals[k])
        poly_sym += term
    
    # Expandir y simplificar
    poly_reduced = sympy.expand(poly_sym)
    return sympy.latex(poly_reduced)
