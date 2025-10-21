import type { NextFunction, Request, Response } from "express";
import { UiController } from "../controllers/ui-controller.js";

// Middleware to check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.isAuthenticated && req.session.user) {
    next();
  } else {
    // Store the intended URL to redirect after login
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login?error=unauthorized");
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.isAuthenticated && req.session.user?.role === "admin") {
    next();
  } else {
    res.status(403).render("error", {
      title: "Access Denied",
      message: "You don't have permission to access this page.",
      statusCode: 403,
    });
  }
};

// Middleware to prevent admins from accessing certain routes (like applying for jobs)
export const preventAdminAccess = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.isAuthenticated && req.session.user?.role === "admin") {
    res.status(403).render("error", {
      title: "Access Denied",
      message: "Administrators cannot apply for job positions.",
      statusCode: 403,
    });
  } else {
    next();
  }
};

// Middleware to add user info and UI state to all templates
export const addUserToLocals = (req: Request, res: Response, next: NextFunction): void => {
  const isAuthenticated = req.session.isAuthenticated || false;
  const currentUser = req.session.user || null;

  // Basic user info (keep for backward compatibility)
  res.locals.currentUser = currentUser;
  res.locals.isAuthenticated = isAuthenticated;

  // Enhanced UI state
  res.locals.headerState = UiController.getHeaderState(isAuthenticated, currentUser);

  next();
};
