import axios from "axios";
import type { BackendLoginResponse, LoginRequest, LoginResponse, User } from "../models/user.js";

export class AuthService {
  constructor(private baseUrl: string) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<BackendLoginResponse>(
        `${this.baseUrl}/api/auth/login`,
        credentials
      );

      // Transform backend response to frontend format
      if (response.data.message === "Login successful" && response.data.user) {
        return {
          success: true,
          data: {
            user: {
              id: response.data.user.id,
              username: `${response.data.user.firstName} ${response.data.user.lastName}`,
              email: response.data.user.email,
              role: response.data.user.role === "admin" ? "admin" : "member",
              createdAt: new Date(),
            },
            token: response.data.token,
          },
        };
      }

      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    } catch (error) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }
        if (error.response?.status === 400) {
          return {
            success: false,
            message: "Please provide email and password",
          };
        }
      }

      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  }

  async validateSession(token?: string): Promise<User | null> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get<{ success: boolean; data: User }>(
        `${this.baseUrl}/api/auth/me`,
        { headers }
      );

      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Session validation error:", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/api/auth/logout`);
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    }
  }
}
