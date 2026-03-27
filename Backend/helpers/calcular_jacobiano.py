import sympy as sp
import numpy as np
from helpers.parser_matematico import obtener_funciones_numericas

def calcular_jacobiano_analitico(funciones_str: list, variables_str: list):
    """
    Calcula la matriz Jacobiana ANALÍTICA y genera representaciones en LaTeX.
    """
    # 1. Obtener expresiones de SymPy y símbolos
    _, exprs, simbolos = obtener_funciones_numericas(funciones_str, variables_str)
    
    # 2. Calcular la matriz Jacobiana simbólicamente
    matriz_jacobiana_simbolica = sp.Matrix(exprs).jacobian(simbolos)
    
    # 3. Generar representaciones en LaTeX para la UI
    # Esto permite mostrar F(x) y J(x) como fórmulas matemáticas reales
    latex_funciones = [sp.latex(f) for f in exprs]
    latex_jacobiano = sp.latex(matriz_jacobiana_simbolica)
    
    # 4. Lambdificar para cálculos numéricos
    f_num = sp.lambdify(simbolos, exprs, "numpy")
    j_num = sp.lambdify(simbolos, matriz_jacobiana_simbolica, "numpy")
    
    return {
        "f_eval": f_num,
        "j_eval": j_num,
        "simbolos": simbolos,
        "latex": {
            "funciones": latex_funciones,
            "jacobiano": latex_jacobiano
        }
    }
