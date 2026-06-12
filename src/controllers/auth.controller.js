import * as authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.registerUser({ email, password, name });
    
    res
      .status(201)
      .json(new ApiResponse(201, result, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res
      .status(200)
      .json(new ApiResponse(200, result, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};
