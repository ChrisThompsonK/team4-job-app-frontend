import type { Request, Response } from "express";
import type { AuthService } from "../services/authService.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  // Show login page
  showLogin = (req: Request, res: Response): void => {
    // Redirect to home if already logged in
    if (req.session.isAuthenticated) {
      res.redirect("/");
      return;
    }

    let errorMessage = "";
    if (req.query.error === "invalid-credentials") {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (req.query.error === "missing-fields") {
      errorMessage = "Please provide both email and password.";
    } else if (req.query.error === "login-failed") {
      errorMessage = "Login failed. Please try again.";
    } else if (req.query.error === "unauthorized") {
      errorMessage = "Please log in to access this page.";
    }

    let successMessage = "";
    if (req.query.success === "logout") {
      successMessage = "You have been logged out successfully.";
    }

    res.render("login", {
      title: "Login - Kainos Job Portal",
      errorMessage,
      successMessage,
    });
  };

  // Handle login form submission
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.redirect("/login?error=missing-fields");
        return;
      }

      // Attempt login
      const loginResult = await this.authService.login({ email, password });

      if (loginResult.success && loginResult.data?.user) {
        // Set session data
        req.session.user = loginResult.data.user;
        req.session.isAuthenticated = true;

        // Redirect to intended page or home
        const redirectTo = req.session.redirectTo || "/";
        delete req.session.redirectTo;
        res.redirect(redirectTo);
      } else {
        res.redirect("/login?error=invalid-credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      res.redirect("/login?error=login-failed");
    }
  };

  // Handle logout
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Call backend logout if needed
      await this.authService.logout();

      // Destroy session
      req.session.destroy((err?: Error) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        res.redirect("/login?success=logout");
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.redirect("/");
    }
  };
}
