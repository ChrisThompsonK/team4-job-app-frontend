export interface User {
  id: number;
  username: string;
  email: string;
  role: "member" | "admin";
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    token?: string;
  };
  message?: string;
}

export interface RegistrationResponse {
  success: boolean;
  data?: {
    user: User;
    token?: string;
  };
  message?: string;
}

// Backend API response interfaces
export interface BackendLoginResponse {
  message: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface BackendRegistrationResponse {
  message: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  token: string;
}

// Extend Express session to include user
declare module "express-session" {
  interface SessionData {
    user?: User;
    isAuthenticated?: boolean;
    redirectTo?: string;
  }
}
