import api from './axiosInstance';
import type { NewtonRequest, NewtonResponse } from '../schemas/newton.schema';
import type { FixedPointRequest, FixedPointResponse } from '../schemas/fixed_point.schema';

export const methodsService = {
  /**
   * Ejecuta el método de Newton-Raphson Analítico
   */
  postNewton: async (data: NewtonRequest): Promise<NewtonResponse> => {
    const response = await api.post<NewtonResponse>('/methods/newton', data);
    return response.data;
  },

  /**
   * Ejecuta el método de Punto Fijo
   */
  postFixedPoint: async (data: FixedPointRequest): Promise<FixedPointResponse> => {
    const response = await api.post<FixedPointResponse>('/methods/punto-fijo', data);
    return response.data;
  },
};
