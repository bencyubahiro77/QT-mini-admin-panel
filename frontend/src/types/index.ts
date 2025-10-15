export type Role = 'ADMIN' | 'USER';
export type Status = 'ACTIVE' | 'INACTIVE';


export interface User {
  id: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
  emailHash: string;
  signature: string;
  isVerified?: boolean;
  verificationError?: string;
}

export interface CreateUserDto {
  email: string;
  role?: Role;
  status?: Status;
}

export interface UpdateUserDto {
  email?: string;
  role?: Role;
  status?: Status;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  publicKey: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface UserResponse {
  user: User;
  publicKey: string;
}

export interface UsersResponse {
  users: User[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}
