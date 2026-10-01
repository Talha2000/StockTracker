// @desc   Get the signed-in user's id and username from their JWT
// @route  GET /api/users/me
// @access Private
const getMe = (req, res) => {
  // req.user is the decoded JWT payload (see authMiddleware), not a document
  // to destructure into — the old code did `req.user.id` here, which is a
  // string, and tried to pull { id, username } out of it.
  const { id, username } = req.user;
  res.status(200).json({ id, username });
};

module.exports = {
  getMe,
};
