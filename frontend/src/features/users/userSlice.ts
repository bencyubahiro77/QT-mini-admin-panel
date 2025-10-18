import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState, PaginationMeta, UserQueryParams } from '../../types';
import {
  fetchPublicKey,
  fetchUsers,
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from './userActions';

const initialState: UserState = {
  users: [],
  allUsers: [],
  loading: false,
  error: null,
  publicKey: null,
  pagination: null,
  queryParams: {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    filterRole: 'ALL',
    filterStatus: 'ALL',
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setQueryParams: (state, action: PayloadAction<Partial<UserQueryParams>>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    resetQueryParams: (state) => {
      state.queryParams = initialState.queryParams;
    },
  },
  extraReducers: (builder) => {
    // Fetch public key
    builder
      .addCase(fetchPublicKey.fulfilled, (state, action) => {
        state.publicKey = action.payload;
      });

    // Fetch users (paginated)
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{ users: User[]; pagination: PaginationMeta }>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });

    // Fetch all users (for dashboard)
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch all users';
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      });
  },
});

export const { clearError, setLoading, setQueryParams, resetQueryParams } = userSlice.actions;
export default userSlice.reducer;

export { fetchPublicKey, fetchUsers, fetchAllUsers, createUser, updateUser, deleteUser };
