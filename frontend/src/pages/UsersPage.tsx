import { useState} from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { UserTable } from '../features/users/UserTable';
import { UserForm } from '../features/users/UserForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers, createUser, updateUser, deleteUser } from '../features/users/userSlice';
import { useToast } from '../components/ui/use-toast';
import { User, CreateUserDto, UpdateUserDto } from '../types';
import { useRefresh } from '../app/refresh';

export function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { isRefreshing, handleRefresh } = useRefresh(
    () => dispatch(fetchUsers()).unwrap(),
    { successMessage: 'Users data refreshed successfully' }
  );

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
      dispatch(fetchUsers());
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleCreateClick}>
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
      />

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
