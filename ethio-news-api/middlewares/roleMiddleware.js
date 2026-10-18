const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (!userRole) {
      return res.status(403).json({ error: "Unauthorized - No role provided" });
    }

    if (userRole !== requiredRole) {
      return res
        .status(403)
        .json({ error: "Unauthorized - Insufficient permissions" });
    }

    next();
  };
};

module.exports = roleMiddleware;
