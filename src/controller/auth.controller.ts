import { Request, Response } from 'express';
import { loginUser, registerAdminUser, getCurrentUserProfile, changeUserPassword } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    new ApiResponse(res).success({ token });
  } catch (error) {
    new ApiResponse(res).unauthorized(error.message);
  }
};

export const registerAdminUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await registerAdminUser(userData);
    new ApiResponse(res).created(newUser, 'Admin user created successfully');
  } catch (error) {
    new ApiResponse(res).badRequest(error.message);
  }
};
