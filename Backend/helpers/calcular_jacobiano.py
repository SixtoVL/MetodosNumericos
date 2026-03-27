import sympy as sp
import numpy as np
from helpers.parser_matematico import obtener_funciones_numericas

def calcular_jacobiano_analitico(funciones_str: list, variables_str: list):
    """
    Calcula la matriz Jacobiana ANALÍTICA de un sistema de n-ecuaciones.
    Devuelve funciones lambdificadas rápidas tanto para F(x) como para J(x).
    """
    # 1. Obtener expresiones de SymPy y símbolos
    _, exprs, simbolos = obtener_funciones_numericas(funciones_str, variables_str)
    
    # 2. Calcular la matriz Jacobiana simbólicamente
    # Esto genera una matriz de expresiones derivadas: dFi/dxj
    matriz_jacobiana_simbolica = sp.Matrix(exprs).jacobian(simbolos)
    
    # 3. Lambdificar ambas para cálculos numéricos ultrarrápidos con NumPy
    # F(x1, x2, ...) -> Vector
    f_num = sp.lambdify(simbolos, exprs, "numpy")
    # J(x1, x2, ...) -> Matriz
    j_num = sp.lambdify(simbolos, matriz_jacobiana_simbolica, "numpy")
    
    return f_num, j_num
