from fastapi import APIRouter
from controllers.newton_controller import solve_newton
from controllers.fixed_point_controller import solve_fixed_point
from controllers.interpolation_controller import solve_divided_differences
from schemas.newton_schema import NewtonSchema
from schemas.fixed_point_schema import FixedPointSchema
from schemas.interpolation_schema import InterpolationSchema

router = APIRouter()

@router.post("/newton")
def newton_endpoint(data: NewtonSchema):
    return solve_newton(data)

@router.post("/punto-fijo")
def punto_fijo_endpoint(data: FixedPointSchema):
    return solve_fixed_point(data)

@router.post("/interpolacion/diferencias-divididas")
def diferencias_divididas_endpoint(data: InterpolationSchema):
    return solve_divided_differences(data)