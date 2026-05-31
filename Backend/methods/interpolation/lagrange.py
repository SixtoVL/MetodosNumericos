import sympy
import numpy as np

def lagrange_method(puntos):
    """
    Calcula el polinomio de interpolación de Lagrange y el procedimiento paso a paso.
    """
    n = len(puntos)
    x_vals = [p.x for p in puntos]
    y_vals = [p.y for p in puntos]
    
    x_sym = sympy.Symbol('x')
    l_polys = []
    pasos = []
    
    # 1. Calcular los polinomios base de Lagrange L_i(x)
    for i in range(n):
        numerador = 1
        denominador = 1
        numerador_latex = ""
        denominador_latex = ""
        
        for j in range(n):
            if i == j:
                continue
            
            numerador *= (x_sym - x_vals[j])
            denominador *= (x_vals[i] - x_vals[j])
            
            # Formatear para el paso a paso
            signo_xj = "-" if x_vals[j] >= 0 else "+"
            numerador_latex += f"(x {signo_xj} {abs(x_vals[j]):.4g})"
            
            signo_xi_xj = "-" if x_vals[j] >= 0 else "+"
            denominador_latex += f"({x_vals[i]:.4g} {signo_xi_xj} {abs(x_vals[j]):.4g})"
            
        li_poly = numerador / denominador
        l_polys.append(li_poly)
        
        pasos.append({
            "orden": i,
            "descripcion": f"Cálculo del polinomio base L_{i}(x)",
            "formula": f"L_{{{i}}}(x) = \\frac{{{numerador_latex}}}{{{denominador_latex}}} = {sympy.latex(sympy.simplify(li_poly))}"
        })
        
    # 2. Construir el polinomio completo P(x) = sum(y_i * L_i(x))
    p_poly = 0
    terminos_lagrange_latex = []
    for i in range(n):
        p_poly += y_vals[i] * l_polys[i]
        
        signo = "+" if y_vals[i] >= 0 else "-"
        valor = abs(y_vals[i])
        if i == 0:
            terminos_lagrange_latex.append(f"{y_vals[i]:.4g} \\cdot L_{{{i}}}(x)")
        else:
            terminos_lagrange_latex.append(f"{signo} {valor:.4g} \\cdot L_{{{i}}}(x)")
            
    polinomio_latex = " ".join(terminos_lagrange_latex)
    
    # Simplificar el polinomio final
    p_poly_simplified = sympy.simplify(p_poly)
    polinomio_reducido_latex = sympy.latex(sympy.expand(p_poly_simplified))
    
    return {
        "pasos": pasos,
        "polinomio_latex": f"P(x) = {polinomio_latex}",
        "polinomio_reducido_latex": f"P(x) = {polinomio_reducido_latex}",
        "puntos_x": x_vals,
        "puntos_y": y_vals,
        "nodos_x": x_vals,
        # Necesitamos una forma de evaluar el polinomio
        "p_poly": p_poly_simplified
    }
