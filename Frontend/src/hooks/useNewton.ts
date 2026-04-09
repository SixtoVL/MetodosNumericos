import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { NewtonRequest, NewtonResponse } from '../schemas/newton.schema';

/**
 * Hook para manejar la ejecución del método de Newton-Raphson con persistencia de estado
 */
export const useNewton = () => {
  const queryClient = useQueryClient();

  // 1. Hook de Mutación: Ejecuta el cálculo y guarda resultados en el caché
  const mutation = useMutation<NewtonResponse, Error, NewtonRequest>({
    mutationFn: (data: NewtonRequest) => methodsService.postNewton(data),
    onSuccess: (data, variables) => {
      // Guardamos el resultado exitoso en una Query estática
      queryClient.setQueryData(['newton-result'], data);
      // Guardamos también los valores del formulario para persistirlos
      queryClient.setQueryData(['newton-form-values'], variables);
    },
  });

  // 2. Query para obtener el último resultado persistido
  const lastResult = useQuery<NewtonResponse>({
    queryKey: ['newton-result'],
    queryFn: () => Promise.resolve(null as any), // Dummy fn para evitar error de validación
    enabled: false, // No se dispara sola
  });

  // 3. Query para obtener los últimos valores del formulario
  const formValues = useQuery<NewtonRequest>({
    queryKey: ['newton-form-values'],
    queryFn: () => Promise.resolve(null as any), // Dummy fn para evitar error de validación
    enabled: false,
  });

  return {
    mutation,
    lastResult: lastResult.data,
    formValues: formValues.data
  };
};
