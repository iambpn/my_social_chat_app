function RequireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next();
}

function BlockAuth(req, res, next) {
  if (req.session.user) {
    return res.status(200).json({
      message: "You are already logged in.",
    });
  }
  next();
}

module.exports = {
  RequireAuth,
  BlockAuth
};
