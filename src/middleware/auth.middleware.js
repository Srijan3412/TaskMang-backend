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
    const decoded = jwt.verify(token, env.JWT_SECRET);

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
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, "Invalid or expired authorization token"));
    } else {
      next(error);
    }
  }
};

export default authMiddleware;
