import type { Request, Response } from 'express';

// @desc   Get the signed-in user's id and username from their session cookie
// @route  GET /api/users/me
// @access Private
export const getMe = (req: Request, res: Response): void => {
  // req.user is set by authMiddleware.protect from the verified JWT.
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const { id, username } = req.user;
  res.status(200).json({ id, username });
};
