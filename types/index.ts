// User types
export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateUserDTO {
    email: string;
    username: string;
    password: string;
  }
  
  export interface UpdateUserDTO {
    email?: string;
    username?: string;
  }
  
  // API Response types
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
  
  // Request types (for Express with custom properties)
  export interface AuthenticatedRequest extends Request {
    user?: User;
    token?: string;
  }
  
  // Error types
  export interface ApiError {
    statusCode: number;
    message: string;
    stack?: string;
  }
  
  // Database query types
  export interface QueryOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }
  