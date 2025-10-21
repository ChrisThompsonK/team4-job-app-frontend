import type { Request, Response } from "express";
import type { AuthService } from "../services/authService.js";
import { FormController } from "./form-controller.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  // Show login page
  showLogin = (req: Request, res: Response): void => {
    // Redirect to home if already logged in
    if (req.session.isAuthenticated) {
      res.redirect("/");
      return;
    }

    const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
    const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

    res.render("login", {
      title: "Login - Kainos Job Portal",
      errorDisplay,
      successDisplay,
    });
  };

  // Handle login form submission
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validate required fields using FormController
      const formErrors = FormController.validateRequiredFields(req.body, ["email", "password"]);
      if (Object.keys(formErrors).length > 0) {
        res.redirect("/login?error=missing-fields");
        return;
      }

      // Validate email format
      if (!FormController.validateEmail(email)) {
        res.redirect("/login?error=invalid-credentials");
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

        // Add success message only if redirecting to homepage
        if (redirectTo === "/") {
          res.redirect("/?success=login");
        } else {
          res.redirect(redirectTo);
        }
      } else {
        res.redirect("/login?error=invalid-credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      res.redirect("/login?error=server-error");
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
