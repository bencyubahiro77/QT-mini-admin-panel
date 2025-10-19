export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: Date;
  emailHash: string;
  signature: string;
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

export interface UpdateUserData {
  email?: string;
  role?: string;
  status?: string;
  emailHash?: string;
  signature?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HashAndSignResult {
  emailHash: string;
  signature: string;
}

export interface VerifySignatureParams {
  data: string;
  signature: string;
  publicKey?: string;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

// Validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidateUserInput {
  email?: string;
  role?: string;
  status?: string;
}

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
} 
