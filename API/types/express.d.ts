// Augments Express's Request with the shape authMiddleware.protect attaches
// after verifying the session cookie — the decoded JWT payload, not a full
// Prisma User (no password hash ever ends up on req.user).
export interface AuthUser {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
