import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 12;

/**
 * Sign a JWT access token for a given user payload.
 */
const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ─── Register ────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Throws ApiError if the email is already taken.
 */
export const registerUser = async ({ email, password, name }) => {
  // 1. Check if the email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Create the user
  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // 4. Generate token
  const token = signToken(user);

  return { user, token };
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Login an existing user.
 * Throws ApiError if the user does not exist or the password is wrong.
 * Uses a generic message to avoid revealing whether the email exists.
 */
export const loginUser = async ({ email, password }) => {
  // 1. Look up the user — MUST exist before we do anything else
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Generic message prevents email enumeration
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Compare provided password against the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Build safe user object (exclude password from response)
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  // 4. Generate token
  const token = signToken(safeUser);

  return { user: safeUser, token };
};
