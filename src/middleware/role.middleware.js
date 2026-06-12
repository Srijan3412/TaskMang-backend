import ApiError from "../utils/ApiError.js";

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(403, `Forbidden: Access restricted to roles: [${allowedRoles.join(", ")}]`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default roleMiddleware;
