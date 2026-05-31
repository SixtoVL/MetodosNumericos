import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { LagrangeRequest, LagrangeResponse } from '../schemas/interpolation.schema';

/**
 * Hook para manejar la ejecución de Interpolación de Lagrange con persistencia de estado
 */
export const useLagrangeInterpolation = () => {
  const queryClient = useQueryClient();

  // 1. Hook de Mutación: Ejecuta el cálculo y guarda resultados en el caché
  const mutation = useMutation<LagrangeResponse, Error, LagrangeRequest>({
    mutationFn: (data: LagrangeRequest) => methodsService.postLagrange(data),
    onSuccess: (data, variables) => {
      // Guardamos el resultado exitoso en una Query estática
      queryClient.setQueryData(['lagrange-result'], data);
      // Guardamos también los valores del formulario para persistirlos
      queryClient.setQueryData(['lagrange-form-values'], variables);
    },
  });

  // 2. Query para obtener el último resultado persistido
  const lastResult = useQuery<LagrangeResponse>({
    queryKey: ['lagrange-result'],
    queryFn: () => Promise.resolve(null as any),
    enabled: false,
  });

  // 3. Query para obtener los últimos valores del formulario
  const formValues = useQuery<LagrangeRequest>({
    queryKey: ['lagrange-form-values'],
    queryFn: () => Promise.resolve(null as any),
    enabled: false,
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data || lastResult.data,
    isPending: mutation.isPending,
    error: mutation.error,
    formValues: formValues.data
  };
};
