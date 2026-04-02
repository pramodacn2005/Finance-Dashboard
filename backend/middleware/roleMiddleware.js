export const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const hasPermission = requiredPermissions.some(p => req.user.role.permissions.includes(p));
    if (!hasPermission) {
      return res.status(403).json({
        message: `User is not authorized. Missing required permissions.`,
      });
    }
    next();
  };
};
