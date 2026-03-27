import api from './axiosInstance';
import type { NewtonRequest, NewtonResponse } from '../schemas/newton.schema';

export const methodsService = {
  /**
   * Ejecuta el método de Newton-Raphson Analítico
   */
  postNewton: async (data: NewtonRequest): Promise<NewtonResponse> => {
    const response = await api.post<NewtonResponse>('/methods/newton', data);
    return response.data;
  },
};
