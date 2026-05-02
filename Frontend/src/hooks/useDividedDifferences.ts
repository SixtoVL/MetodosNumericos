import { useMutation } from '@tanstack/react-query';
import { methodsService } from '../api/methodsService';
import type { DividedDifferencesRequest, DividedDifferencesResponse } from '../schemas/interpolation.schema';

export const useDividedDifferences = () => {
  return useMutation<DividedDifferencesResponse, Error, DividedDifferencesRequest>({
    mutationFn: (data) => methodsService.postDividedDifferences(data),
  });
};
