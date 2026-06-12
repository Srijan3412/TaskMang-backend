import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../database/prisma.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token is missing or malformed");
    }

    const token = authHeader.split(" ")[1];

    // Verify token — catches expired and tampered tokens separately
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Token has expired, please login again");
      }
      if (jwtError instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Invalid authorization token");
      }
      throw jwtError;
    }

    // Verify user still exists in database (account not deleted after token issued)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid token: user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
