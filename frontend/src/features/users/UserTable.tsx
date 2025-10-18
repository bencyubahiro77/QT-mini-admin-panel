import { useState } from 'react';
import { Pencil, Trash2, Shield, ShieldAlert, CheckCircle, XCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, ExtendedUserTableProps } from '../../types';
import { formatDateTime } from '@/lib/utils';


export function UserTable({ users, onEdit, onDelete, loading, queryParams, onSort }: ExtendedUserTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (!queryParams || queryParams.sortBy !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    return queryParams.sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Filter only verified users
  const verifiedUsers = users.filter((user) => user.isVerified !== false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (verifiedUsers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No verified users found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center hover:text-foreground transition-colors"
                  disabled={!onSort}
                >
                  Email
                  {onSort && getSortIcon('email')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center hover:text-foreground transition-colors"
                  disabled={!onSort}
                >
                  Role
                  {onSort && getSortIcon('role')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center hover:text-foreground transition-colors"
                  disabled={!onSort}
                >
                  Status
                  {onSort && getSortIcon('status')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center hover:text-foreground transition-colors"
                  disabled={!onSort}
                >
                  Created
                  {onSort && getSortIcon('createdAt')}
                </button>
              </TableHead>
              <TableHead>Signature</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifiedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.role === 'ADMIN' ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(user.createdAt)}
                </TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xs">Invalid</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      title="Edit user"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(user)}
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user{' '}
              <strong>{userToDelete?.email}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
