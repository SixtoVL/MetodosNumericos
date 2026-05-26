import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { HermiteRequest, DividedDifferencesResponse } from '../schemas/interpolation.schema';

export const useHermiteInterpolation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: HermiteRequest) => methodsService.postHermite(data),
    onSuccess: (data, variables) => {
      // Guardar el último resultado y valores del formulario en caché
      queryClient.setQueryData(['hermite-last-result'], data);
      queryClient.setQueryData(['hermite-form-values'], variables);
    }
  });

  const lastResult = useQuery({
    queryKey: ['hermite-last-result'],
    queryFn: () => Promise.resolve(null as any),
    enabled: false,
  });

  const formValues = useQuery({
    queryKey: ['hermite-form-values'],
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
