import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { User, CreateUserDto, UpdateUserDto } from '../../types';
import { decodeUserList, initializeProtobuf } from '../../utils/protobuf';
import { verifyUserIntegrity } from '../../utils/crypto';
import { RootState } from '../../app/store';


export const fetchPublicKey = createAsyncThunk(
  'users/fetchPublicKey',
  async () => {
    const response = await api.get('/users/public-key');
    return response.data.publicKey;
  }
);

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, dispatch }) => {
    await initializeProtobuf();

    const state = getState() as RootState;
    let publicKey = state.users.publicKey;
    
    if (!publicKey) {
      const action = await dispatch(fetchPublicKey());
      publicKey = action.payload as string;
    }

    const response = await api.get('/users/export', {
      responseType: 'arraybuffer',
    });

    const uint8Array = new Uint8Array(response.data);
    const decoded = decodeUserList(uint8Array);
    const users: User[] = decoded.users || [];

    const verifiedUsers = await Promise.all(
      users.map(async (user) => {
        try {
          const verification = await verifyUserIntegrity(
            user.email,
            user.emailHash,
            user.signature,
            publicKey!
          );
          
          return {
            ...user,
            isVerified: verification.valid,
            verificationError: !verification.valid 
              ? `Hash: ${verification.hashValid ? '✓' : '✗'}, Sig: ${verification.signatureValid ? '✓' : '✗'}`
              : undefined,
          };
        } catch {
          return {
            ...user,
            isVerified: false,
            verificationError: 'Verification failed',
          };
        }
      })
    );

    return verifiedUsers;
  }
);


export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserDto) => {
    const response = await api.post('/users', userData);
    return response.data.user;
  }
);


export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: UpdateUserDto }) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.user;
  }
);


export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    await api.delete(`/users/${id}`);
    return id;
  }
);
