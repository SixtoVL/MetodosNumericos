import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { FixedPointRequest, FixedPointResponse } from '../schemas/fixed_point.schema';

/**
 * Hook para manejar la ejecución del método de Punto Fijo con persistencia de estado
 */
export const useFixedPoint = () => {
  const queryClient = useQueryClient();

  // 1. Hook de Mutación: Ejecuta el cálculo y guarda resultados en el caché
  const mutation = useMutation<FixedPointResponse, Error, FixedPointRequest>({
    mutationFn: (data: FixedPointRequest) => methodsService.postFixedPoint(data),
    onSuccess: (data, variables) => {
      // Guardamos el resultado exitoso en una Query estática
      queryClient.setQueryData(['fixed-point-result'], data);
      // Guardamos también los valores del formulario para persistirlos
      queryClient.setQueryData(['fixed-point-form-values'], variables);
    },
  });

  // 2. Query para obtener el último resultado persistido
  const lastResult = useQuery<FixedPointResponse>({
    queryKey: ['fixed-point-result'],
    queryFn: () => Promise.resolve(null as any),
    enabled: false,
  });

  // 3. Query para obtener los últimos valores del formulario
  const formValues = useQuery<FixedPointRequest>({
    queryKey: ['fixed-point-form-values'],
    queryFn: () => Promise.resolve(null as any),
    enabled: false,
  });

  return {
    mutation,
    lastResult: lastResult.data,
    formValues: formValues.data
  };
};
