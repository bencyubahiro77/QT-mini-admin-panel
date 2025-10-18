import { useState } from 'react';
import { useToast } from '../components/ui/use-toast';
import { UseRefreshOptions } from '../types';


export function useRefresh(
  refreshFn: () => Promise<any>,
  options?: UseRefreshOptions
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshFn();
      toast({
        title: 'Success',
        description: options?.successMessage || 'Data refreshed successfully',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || options?.errorMessage || 'Failed to refresh data',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return { isRefreshing, handleRefresh };
}