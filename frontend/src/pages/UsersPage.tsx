import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { UserTable } from '../features/users/UserTable';
import { UserForm } from '../features/users/UserForm';
import { CompactUserFilters } from '../features/users/CompactUserFilters';
import { Pagination } from '../components/ui/pagination';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers, fetchAllUsers, createUser, updateUser, deleteUser, setQueryParams, resetQueryParams } from '../features/users/userSlice';
import { useToast } from '../components/ui/use-toast';
import { User, CreateUserDto, UpdateUserDto, UserQueryParams } from '../types';
import { useRefresh } from '../app/refresh';

export function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, pagination, queryParams } = useAppSelector((state) => state.users);
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers(queryParams));
  }, [dispatch, queryParams.page, queryParams.limit, queryParams.search, queryParams.sortBy, queryParams.sortOrder, queryParams.filterRole, queryParams.filterStatus]);

  const { isRefreshing, handleRefresh } = useRefresh(
    async () => {
      await dispatch(fetchUsers(queryParams)).unwrap();
      await dispatch(fetchAllUsers()).unwrap();
    },
    { successMessage: 'Users data refreshed successfully' }
  );

  const handleQueryChange = (params: Partial<UserQueryParams>) => {
    dispatch(setQueryParams(params));
  };

  const handlePageChange = (page: number) => {
    dispatch(setQueryParams({ page }));
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = 
      queryParams.sortBy === sortBy && queryParams.sortOrder === 'asc' 
        ? 'desc' 
        : 'asc';
    dispatch(setQueryParams({ sortBy, sortOrder: newSortOrder }));
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser.id, data })).unwrap();
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        await dispatch(createUser(data as CreateUserDto)).unwrap();
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
      }
      setFormOpen(false);
      setEditingUser(null);
      dispatch(fetchUsers(queryParams));
      dispatch(fetchAllUsers());
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Operation failed',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      dispatch(fetchAllUsers());
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to delete user',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <div className="flex flex-wrap items-center gap-2">
          <CompactUserFilters
            queryParams={queryParams}
            onQueryChange={handleQueryChange}
          />
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleCreateClick} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <UserTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        loading={loading}
        queryParams={queryParams}
        onSort={handleSort}
      />

      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      )}

      <UserForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={editingUser}
        loading={loading}
      />
    </div>
  );
}
