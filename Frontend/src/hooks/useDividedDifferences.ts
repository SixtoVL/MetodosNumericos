import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { DividedDifferencesRequest, DividedDifferencesResponse } from '../schemas/interpolation.schema';

/**
 * Hook para manejar la ejecución de Interpolación (Newton/Finitas) con persistencia de estado
 */
export const useDividedDifferences = () => {
  const queryClient = useQueryClient();

  // 1. Hook de Mutación: Ejecuta el cálculo y guarda resultados en el caché
  const mutation = useMutation<DividedDifferencesResponse, Error, DividedDifferencesRequest>({
    mutationFn: (data: DividedDifferencesRequest) => methodsService.postDividedDifferences(data),
    onSuccess: (data, variables) => {
      // Guardamos el resultado exitoso en una Query estática
      queryClient.setQueryData(['interpolation-result'], data);
      // Guardamos también los valores del formulario para persistirlos
      queryClient.setQueryData(['interpolation-form-values'], variables);
    },
  });

  // 2. Query para obtener el último resultado persistido
  const lastResult = useQuery<DividedDifferencesResponse>({
    queryKey: ['interpolation-result'],
    queryFn: () => Promise.resolve(null as any),
    enabled: false,
  });

  // 3. Query para obtener los últimos valores del formulario
  const formValues = useQuery<DividedDifferencesRequest>({
    queryKey: ['interpolation-form-values'],
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
