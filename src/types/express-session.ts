// User interface based on the mock user structure in login route
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

// Extend Express Request to include user and session properties
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    session: {
      user?: User;
      destroy(callback: (err?: Error) => void): void;
    } & Record<string, unknown>;
  }
}
