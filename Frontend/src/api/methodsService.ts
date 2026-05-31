import api from './axiosInstance';
import type { NewtonRequest, NewtonResponse } from '../schemas/newton.schema';
import type { FixedPointRequest, FixedPointResponse } from '../schemas/fixed_point.schema';
import type { DividedDifferencesRequest, DividedDifferencesResponse, HermiteRequest, LagrangeRequest, LagrangeResponse } from '../schemas/interpolation.schema';

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

  /**
   * Ejecuta el método de Diferencias Divididas
   */
  postDividedDifferences: async (data: DividedDifferencesRequest): Promise<DividedDifferencesResponse> => {
    const response = await api.post<DividedDifferencesResponse>('/methods/interpolacion/diferencias-divididas', data);
    return response.data;
  },

  /**
   * Ejecuta el método de Lagrange
   */
  postLagrange: async (data: LagrangeRequest): Promise<LagrangeResponse> => {
    const response = await api.post<LagrangeResponse>('/methods/interpolacion/lagrange', data);
    return response.data;
  },

  /**
   * Ejecuta el método de Hermite
   */
  postHermite: async (data: HermiteRequest): Promise<DividedDifferencesResponse> => {
    const response = await api.post<DividedDifferencesResponse>('/methods/interpolacion/hermite', data);
    return response.data;
  },
};
