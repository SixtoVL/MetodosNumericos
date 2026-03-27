import { useMutation } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { NewtonRequest, NewtonResponse } from '../schemas/newton.schema';

/**
 * Hook para manejar la ejecución del método de Newton-Raphson
 */
export const useNewton = () => {
  return useMutation<NewtonResponse, Error, NewtonRequest>({
    mutationFn: (data: NewtonRequest) => methodsService.postNewton(data),
    onSuccess: (data) => {
      console.log('Método ejecutado con éxito:', data);
    },
    onError: (error) => {
      console.error('Error al ejecutar el método:', error);
    },
  });
};
