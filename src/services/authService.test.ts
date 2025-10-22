import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "./authService.js";

// Mock axios
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  isAxiosError: ReturnType<typeof vi.fn>;
};

describe("AuthService", () => {
  let authService: AuthService;
  const baseUrl = "http://localhost:3001";

  beforeEach(() => {
    authService = new AuthService(baseUrl);
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should return success response when login is successful", async () => {
      const mockUser = {
        id: 1,
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        role: "user",
      };

      const mockResponse = {
        data: {
          message: "Login successful",
          user: mockUser,
          token: "test-token",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe("test@example.com");
      expect(result.data?.user.username).toBe("Test User");
      expect(result.data?.user.role).toBe("member");
      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseUrl}/api/auth/login`, {
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should return error response when credentials are invalid", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 401 },
      });
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      const result = await authService.login({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email or password");
    });

    it("should return error response when fields are missing", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 400 },
      });
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      const result = await authService.login({
        email: "",
        password: "password123",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Please provide email and password");
    });
  });

  describe("validateSession", () => {
    it("should return user when session is valid", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        role: "member" as const,
        createdAt: new Date(),
      };

      const mockResponse = {
        data: {
          success: true,
          data: mockUser,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.validateSession("valid-token");

      expect(result).toEqual(mockUser);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: "Bearer valid-token" },
      });
    });

    it("should return null when session is invalid", async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 401 },
      });

      const result = await authService.validateSession("invalid-token");

      expect(result).toBeNull();
    });
  });

  describe("register", () => {
    it("should return success response when registration is successful", async () => {
      const mockUser = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "user",
      };

      const mockResponse = {
        status: 201,
        data: {
          message: "User registered successfully",
          user: mockUser,
          token: "test-token",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe("john.doe@example.com");
      expect(result.data?.user.username).toBe("John Doe");
      expect(result.data?.user.role).toBe("member"); // Should always be member
      expect(result.data?.token).toBe("test-token");
      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseUrl}/api/auth/register`, {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
      });
    });

    it("should return success response with 200 status code", async () => {
      const mockUser = {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        role: "user",
      };

      const mockResponse = {
        status: 200, // Test 200 status code as well
        data: {
          message: "User registered successfully",
          user: mockUser,
          token: "test-token-2",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: "SecurePass123!",
        confirmPassword: "SecurePass123!",
      });

      expect(result.success).toBe(true);
      expect(result.data?.user.role).toBe("member");
    });

    it("should not send confirmPassword to backend", async () => {
      const mockResponse = {
        status: 201,
        data: {
          message: "User registered successfully",
          user: {
            id: 1,
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            role: "user",
          },
          token: "token",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await authService.register({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseUrl}/api/auth/register`, {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "Password123!",
        // confirmPassword should NOT be included
      });
    });

    it("should return error response when required fields are missing", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 400 },
      });
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      const result = await authService.register({
        firstName: "",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Please provide all required fields");
    });

    it("should return error response when validation fails", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 422 },
      });
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      const result = await authService.register({
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        password: "weak",
        confirmPassword: "weak",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Please check your input and try again");
    });

    it("should return generic error for server errors", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));
      mockedAxios.isAxiosError.mockReturnValueOnce(false);

      const result = await authService.register({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Registration failed. Please try again.");
    });

    it("should return error when backend response is missing user data", async () => {
      const mockResponse = {
        status: 200,
        data: {
          message: "User registered successfully",
          // Missing user data
          token: "test-token",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Registration failed. Please try again.");
    });

    it("should always set role to member regardless of backend response", async () => {
      const mockUser = {
        id: 1,
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        role: "admin", // Backend returns admin role
      };

      const mockResponse = {
        status: 201,
        data: {
          message: "User registered successfully",
          user: mockUser,
          token: "test-token",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

      expect(result.success).toBe(true);
      expect(result.data?.user.role).toBe("member"); // Should be forced to member
    });
  });

  describe("logout", () => {
    it("should call logout endpoint", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

      await authService.logout();

      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseUrl}/api/auth/logout`);
    });

    it("should not throw error if logout fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));

      await expect(authService.logout()).resolves.not.toThrow();
    });
  });
});
