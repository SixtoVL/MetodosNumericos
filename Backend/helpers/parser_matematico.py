import sympy as sp
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

def parsear_funcion(funcion_str: str, variables_str: list):
    """
    Convierte un string humano (ej: '3x^2 + sin x') en una expresión de SymPy.
    """
    # 1. Pre-procesamiento: Cambiar ^ por ** para potencias
    f_procesada = funcion_str.replace("^", "**")
    
    # 2. Definir transformaciones para permitir multiplicación implícita (3x -> 3*x)
    transformaciones = standard_transformations + (implicit_multiplication_application,)
    
    # 3. Convertir string a expresión de SymPy
    # Usamos local_dict para asegurar que las variables x_1, x_2 sean reconocidas
    local_dict = {v: sp.symbols(v) for v in variables_str}
    expr = parse_expr(f_procesada, local_dict=local_dict, transformations=transformaciones)
    
    return expr, list(local_dict.values())

def obtener_funciones_numericas(funciones_str: list, variables_str: list):
    """
    Toma una lista de strings y devuelve funciones lambdificadas para NumPy.
    """
    exprs = []
    simbolos_all = [sp.symbols(v) for v in variables_str]
    
    for f_s in funciones_str:
        expr, _ = parsear_funcion(f_s, variables_str)
        exprs.append(expr)
    
    # Convertimos a funciones numéricas de NumPy (extremadamente rápido)
    # Usamos "numpy" para que entienda exp, sin, cos, etc.
    f_num = sp.lambdify(simbolos_all, exprs, "numpy")
    
    return f_num, exprs, simbolos_all
