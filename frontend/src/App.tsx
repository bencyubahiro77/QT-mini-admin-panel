import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchUsers, clearError } from './features/users/userSlice';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';

function App() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.users);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
