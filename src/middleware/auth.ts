import type { NextFunction, Request, Response } from "express";

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

// Middleware to add user info to all templates
export const addUserToLocals = (req: Request, res: Response, next: NextFunction): void => {
  res.locals.currentUser = req.session.user || null;
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  next();
};
