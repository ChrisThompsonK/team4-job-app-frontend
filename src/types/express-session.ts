// User interface based on the mock user structure in login route
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

// Extend Express Request to include session properties
declare module "express-serve-static-core" {
  interface Request {
    session: {
      user?: User;
      destroy(callback: (err?: Error) => void): void;
    } & Record<string, unknown>;
  }
}
