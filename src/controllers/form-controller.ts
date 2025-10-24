interface ErrorDisplay {
  show: boolean;
  message: string;
  type: "error" | "warning" | "info";
  iconClass: string;
  containerClass: string;
  textClass: string;
}

interface SuccessDisplay {
  show: boolean;
  message: string;
  iconClass: string;
  containerClass: string;
  textClass: string;
}

interface FormFieldState {
  hasError: boolean;
  errorMessage: string;
  fieldClass: string;
}

interface FormValidationState {
  hasErrors: boolean;
  fields: Record<string, FormFieldState>;
  globalError?: ErrorDisplay;
}

// biome-ignore lint/complexity/noStaticOnlyClass: Utility class for form validation and error handling
export class FormController {
  /**
   * Get error display information based on error code
   */
  static getErrorDisplay(errorCode: string | null): ErrorDisplay {
    if (!errorCode) {
      return {
        show: false,
        message: "",
        type: "error",
        iconClass: "",
        containerClass: "",
        textClass: "",
      };
    }

    const defaultError = {
      message: "An error occurred. Please try again.",
      type: "error" as const,
    };

    const errorMessages: Record<string, { message: string; type: "error" | "warning" | "info" }> = {
      // Authentication errors
      unauthorized: { message: "Please log in to access this page.", type: "error" },
      "invalid-credentials": {
        message: "Invalid email or password. Please try again.",
        type: "error",
      },
      "session-expired": {
        message: "Your session has expired. Please log in again.",
        type: "warning",
      },

      // Job-related errors
      "invalid-id": { message: "Invalid job ID provided.", type: "error" },
      "not-found": {
        message: "The job you're looking for doesn't exist or has been removed.",
        type: "error",
      },
      "not-available": {
        message: "This job is no longer available for applications.",
        type: "warning",
      },

      // Application form errors
      "missing-fields": { message: "Please fill in all required fields.", type: "error" },
      "missing-cv-file": { message: "Please upload your CV file.", type: "error" },
      "invalid-file-type": {
        message: "Please upload a CV in PDF, DOC, or DOCX format only.",
        type: "error",
      },
      "file-too-large": {
        message: "CV file is too large. Please upload a file smaller than 5MB.",
        type: "error",
      },
      "submission-failed": {
        message: "Failed to submit application. Please try again.",
        type: "error",
      },
      "already-applied": {
        message: "You have already applied for this job. You cannot apply for the same job twice.",
        type: "warning",
      },
      "file-upload-failed": {
        message: "Failed to upload file. Please try again with a different file.",
        type: "error",
      },

      // Registration errors
      "invalid-email": { message: "Please enter a valid email address.", type: "error" },
      "password-mismatch": { message: "Passwords do not match.", type: "error" },
      "weak-password": {
        message: "Password must be at least 8 characters with uppercase, lowercase, and number.",
        type: "error",
      },
      "registration-failed": { message: "Registration failed. Please try again.", type: "error" },

      // General errors
      "server-error": {
        message: "An unexpected error occurred. Please try again later.",
        type: "error",
      },
      "validation-failed": { message: "Please check your input and try again.", type: "error" },
      "update-failed": { message: "Failed to update. Please try again.", type: "error" },
    };

    const errorInfo = errorMessages[errorCode] || defaultError;
    const iconClass = FormController.getIconClass(errorInfo.type);
    const { containerClass, textClass } = FormController.getErrorStyles(errorInfo.type);

    return {
      show: true,
      message: errorInfo.message,
      type: errorInfo.type,
      iconClass,
      containerClass,
      textClass,
    };
  }

  /**
   * Get success display information based on success code
   */
  static getSuccessDisplay(successCode: string | null): SuccessDisplay {
    if (!successCode) {
      return {
        show: false,
        message: "",
        iconClass: "",
        containerClass: "",
        textClass: "",
      };
    }

    const successMessages: Record<string, string> = {
      created: "Job role created successfully!",
      updated: "Updated successfully!",
      deleted: "Deleted successfully!",
      submitted: "Application submitted successfully!",
      accepted: "Application accepted successfully!",
      rejected: "Application rejected.",
      login: "Login successful!",
      logout: "Logged out successfully!",
      registration: "Welcome! Your account has been created successfully!",
    };

    const message = successMessages[successCode] || "Operation completed successfully!";

    return {
      show: true,
      message,
      iconClass: "check-circle",
      containerClass: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6",
      textClass: "text-green-700",
    };
  }

  /**
   * Get form validation state for fields
   */
  static getFormValidationState(
    formData: Record<string, unknown>,
    errors: Record<string, string> = {}
  ): FormValidationState {
    const fields: Record<string, FormFieldState> = {};
    const hasErrors = Object.keys(errors).length > 0;

    // Process each field in the form data
    Object.keys(formData).forEach((fieldName) => {
      const hasError = fieldName in errors;
      fields[fieldName] = {
        hasError,
        errorMessage: errors[fieldName] || "",
        fieldClass: hasError
          ? "input input-bordered w-full border-red-500"
          : "input input-bordered w-full",
      };
    });

    return {
      hasErrors,
      fields,
    };
  }

  /**
   * Validate required fields
   */
  static validateRequiredFields(
    formData: Record<string, unknown>,
    requiredFields: string[]
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field] = `${FormController.formatFieldName(field)} is required.`;
      }
    });

    return errors;
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password match
   */
  static validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return minLength && hasUppercase && hasLowercase && hasNumber;
  }

  /**
   * Get field validation classes
   */
  static getFieldClass(fieldName: string, errors: Record<string, string>): string {
    const hasError = fieldName in errors;
    const baseClass = "input input-bordered w-full";
    return hasError ? `${baseClass} border-red-500` : baseClass;
  }

  /**
   * Get textarea validation classes
   */
  static getTextareaClass(fieldName: string, errors: Record<string, string>): string {
    const hasError = fieldName in errors;
    const baseClass = "textarea textarea-bordered w-full";
    return hasError ? `${baseClass} border-red-500` : baseClass;
  }

  /**
   * Get select validation classes
   */
  static getSelectClass(fieldName: string, errors: Record<string, string>): string {
    const hasError = fieldName in errors;
    const baseClass = "select select-bordered w-full";
    return hasError ? `${baseClass} border-red-500` : baseClass;
  }

  /**
   * Private helper methods
   */
  private static getIconClass(type: "error" | "warning" | "info"): string {
    switch (type) {
      case "error":
        return "alert-circle";
      case "warning":
        return "alert-triangle";
      case "info":
        return "info";
      default:
        return "alert-circle";
    }
  }

  private static getErrorStyles(type: "error" | "warning" | "info"): {
    containerClass: string;
    textClass: string;
  } {
    switch (type) {
      case "error":
        return {
          containerClass: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6",
          textClass: "text-red-700",
        };
      case "warning":
        return {
          containerClass:
            "bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6",
          textClass: "text-yellow-700",
        };
      case "info":
        return {
          containerClass: "bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6",
          textClass: "text-blue-700",
        };
      default:
        return {
          containerClass: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6",
          textClass: "text-red-700",
        };
    }
  }

  private static formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}
