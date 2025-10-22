import { describe, expect, it } from "vitest";
import { FormController } from "./form-controller.js";

describe("FormController", () => {
  describe("validatePasswordMatch", () => {
    it("should return true when passwords match", () => {
      const result = FormController.validatePasswordMatch("Password123!", "Password123!");
      expect(result).toBe(true);
    });

    it("should return false when passwords do not match", () => {
      const result = FormController.validatePasswordMatch("Password123!", "DifferentPassword!");
      expect(result).toBe(false);
    });

    it("should return false when one password is empty", () => {
      const result = FormController.validatePasswordMatch("Password123!", "");
      expect(result).toBe(false);
    });

    it("should return true when both passwords are empty", () => {
      const result = FormController.validatePasswordMatch("", "");
      expect(result).toBe(true);
    });
  });

  describe("validatePasswordStrength", () => {
    it("should return true for strong password", () => {
      const result = FormController.validatePasswordStrength("Password123!");
      expect(result).toBe(true);
    });

    it("should return true for password with minimum requirements", () => {
      const result = FormController.validatePasswordStrength("Abc123def");
      expect(result).toBe(true);
    });

    it("should return false for password too short", () => {
      const result = FormController.validatePasswordStrength("Abc123");
      expect(result).toBe(false);
    });

    it("should return false for password without uppercase", () => {
      const result = FormController.validatePasswordStrength("password123!");
      expect(result).toBe(false);
    });

    it("should return false for password without lowercase", () => {
      const result = FormController.validatePasswordStrength("PASSWORD123!");
      expect(result).toBe(false);
    });

    it("should return false for password without numbers", () => {
      const result = FormController.validatePasswordStrength("PasswordOnly!");
      expect(result).toBe(false);
    });

    it("should return false for empty password", () => {
      const result = FormController.validatePasswordStrength("");
      expect(result).toBe(false);
    });

    it("should return true for complex password with special characters", () => {
      const result = FormController.validatePasswordStrength("MyP@ssw0rd123!");
      expect(result).toBe(true);
    });
  });

  describe("validateEmail", () => {
    it("should return true for valid email", () => {
      const result = FormController.validateEmail("test@example.com");
      expect(result).toBe(true);
    });

    it("should return true for email with subdomain", () => {
      const result = FormController.validateEmail("user@mail.company.com");
      expect(result).toBe(true);
    });

    it("should return false for email without @", () => {
      const result = FormController.validateEmail("testexample.com");
      expect(result).toBe(false);
    });

    it("should return false for email without domain", () => {
      const result = FormController.validateEmail("test@");
      expect(result).toBe(false);
    });

    it("should return false for email without local part", () => {
      const result = FormController.validateEmail("@example.com");
      expect(result).toBe(false);
    });

    it("should return false for empty email", () => {
      const result = FormController.validateEmail("");
      expect(result).toBe(false);
    });

    it("should return false for email with spaces", () => {
      const result = FormController.validateEmail("test @example.com");
      expect(result).toBe(false);
    });
  });

  describe("validateRequiredFields", () => {
    it("should return empty object when all required fields are present", () => {
      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };
      const requiredFields = ["firstName", "lastName", "email"];

      const result = FormController.validateRequiredFields(formData, requiredFields);
      expect(result).toEqual({});
    });

    it("should return errors for missing fields", () => {
      const formData = {
        firstName: "John",
        lastName: "",
        email: undefined,
      };
      const requiredFields = ["firstName", "lastName", "email"];

      const result = FormController.validateRequiredFields(formData, requiredFields);
      expect(result).toHaveProperty("lastName");
      expect(result).toHaveProperty("email");
      expect(result).not.toHaveProperty("firstName");
    });

    it("should return errors for fields with only whitespace", () => {
      const formData = {
        firstName: "   ",
        lastName: "Doe",
      };
      const requiredFields = ["firstName", "lastName"];

      const result = FormController.validateRequiredFields(formData, requiredFields);
      expect(result).toHaveProperty("firstName");
      expect(result).not.toHaveProperty("lastName");
    });
  });

  describe("getErrorDisplay", () => {
    it("should return show: false for null error", () => {
      const result = FormController.getErrorDisplay(null);
      expect(result.show).toBe(false);
    });

    it("should return show: false for empty error", () => {
      const result = FormController.getErrorDisplay("");
      expect(result.show).toBe(false);
    });

    it("should return proper error display for registration errors", () => {
      const result = FormController.getErrorDisplay("password-mismatch");
      expect(result.show).toBe(true);
      expect(result.message).toBe("Passwords do not match.");
      expect(result.type).toBe("error");
    });

    it("should return proper error display for weak password", () => {
      const result = FormController.getErrorDisplay("weak-password");
      expect(result.show).toBe(true);
      expect(result.message).toBe(
        "Password must be at least 8 characters with uppercase, lowercase, and number."
      );
      expect(result.type).toBe("error");
    });

    it("should return proper error display for invalid email", () => {
      const result = FormController.getErrorDisplay("invalid-email");
      expect(result.show).toBe(true);
      expect(result.message).toBe("Please enter a valid email address.");
      expect(result.type).toBe("error");
    });

    it("should return default error for unknown error code", () => {
      const result = FormController.getErrorDisplay("unknown-error");
      expect(result.show).toBe(true);
      expect(result.message).toBe("An error occurred. Please try again.");
      expect(result.type).toBe("error");
    });
  });

  describe("getSuccessDisplay", () => {
    it("should return show: false for null success", () => {
      const result = FormController.getSuccessDisplay(null);
      expect(result.show).toBe(false);
    });

    it("should return proper success display for registration", () => {
      const result = FormController.getSuccessDisplay("registration");
      expect(result.show).toBe(true);
      expect(result.message).toBe("Welcome! Your account has been created successfully!");
      expect(result.iconClass).toBe("check-circle");
    });

    it("should return proper success display for login", () => {
      const result = FormController.getSuccessDisplay("login");
      expect(result.show).toBe(true);
      expect(result.message).toBe("Login successful!");
    });

    it("should return default success message for unknown code", () => {
      const result = FormController.getSuccessDisplay("unknown-success");
      expect(result.show).toBe(true);
      expect(result.message).toBe("Operation completed successfully!");
    });
  });
});
