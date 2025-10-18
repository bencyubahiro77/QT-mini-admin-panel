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

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterRole?: Role | 'ALL';
  filterStatus?: Status | 'ALL';
}

export interface UserState {
  users: User[]; // Paginated users for Users page
  allUsers: User[]; // All users for Dashboard
  loading: boolean;
  error: string | null;
  publicKey: string | null;
  pagination: PaginationMeta | null;
  queryParams: UserQueryParams;
}

export interface CompactUserFiltersProps {
  queryParams: UserQueryParams;
  onQueryChange: (params: Partial<UserQueryParams>) => void;
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

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavbarProps {
  onMenuClick: () => void;
}

export interface DashboardProps {
  users: User[];
}

export interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  user?: User | null;
  loading?: boolean;
}

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export interface UseRefreshOptions {
  successMessage?: string;
  errorMessage?: string;
}

export interface ExtendedUserTableProps extends UserTableProps {
  queryParams?: UserQueryParams;
  onSort?: (sortBy: string) => void;
}