import sys
import os

# Añadir Backend al path para poder importar
sys.path.append(os.path.abspath('Backend'))

from methods.fixed_point.helpers.parser_punto_fijo import obtener_funciones_punto_fijo
import numpy as np

def test():
    print("Probando Parser de Punto Fijo...")
    g_funcs = ["cos(x_1)", "sin(x_2)"]
    vars_str = ["x_1", "x_2"]
    
    try:
        g_num, exprs, simbolos, latex_g = obtener_funciones_punto_fijo(g_funcs, vars_str)
        print("Parser exitoso!")
        print(f"LaTeX: {latex_g}")
        
        x = [0.5, 0.5]
        res = g_num(*x)
        print(f"Resultado evaluacion (0.5, 0.5): {res}")
        
        # Probar 1 variable
        g_1 = ["cos(x_1)"]
        v_1 = ["x_1"]
        g_num_1, _, _, _ = obtener_funciones_punto_fijo(g_1, v_1)
        x_1 = [0.5]
        res_1 = g_num_1(*x_1)
        print(f"Resultado evaluacion 1 var (0.5): {res_1}")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
