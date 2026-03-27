from fastapi import APIRouter
from controllers.newton_controller import solve_newton
from schemas.newton_schema import NewtonSchema

router = APIRouter()

@router.post("/newton")
def newton_endpoint(data: NewtonSchema):
    return solve_newton(data)