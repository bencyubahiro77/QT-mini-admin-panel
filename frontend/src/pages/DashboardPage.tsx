
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dashboard } from '../features/dashboard/Dashboard';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers } from '../features/users/userSlice';
import { useRefresh } from "../app/refresh";

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  const { isRefreshing, handleRefresh } = useRefresh(
    () => dispatch(fetchUsers()).unwrap(),
    { successMessage: 'Dashboard data refreshed successfully' }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <Dashboard users={users} />
    </div>
  );
}
