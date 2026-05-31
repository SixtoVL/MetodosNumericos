import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { LeastSquaresRequest, LeastSquaresResponse } from '../schemas/regression.schema';

export const useLeastSquares = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<LeastSquaresResponse, Error, LeastSquaresRequest>({
    mutationFn: (data: LeastSquaresRequest) => methodsService.postLeastSquares(data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['least-squares-result'], data);
      queryClient.setQueryData(['least-squares-form-values'], variables);
    },
  });

  const lastResult = useQuery<LeastSquaresResponse>({
    queryKey: ['least-squares-result'],
    queryFn: () => Promise.resolve(null as any),
    enabled: false,
  });

  const formValues = useQuery<LeastSquaresRequest>({
    queryKey: ['least-squares-form-values'],
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
