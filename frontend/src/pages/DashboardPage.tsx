
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dashboard } from '../features/dashboard/Dashboard';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers } from '../features/users/userSlice';
import { useToast } from '../components/ui/use-toast';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { toast } = useToast();

  const handleRefresh = () => {
    dispatch(fetchUsers());
    toast({
      title: 'Refreshing',
      description: 'Fetching latest user data...',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Dashboard users={users} />
    </div>
  );
}
