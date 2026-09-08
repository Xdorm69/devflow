import { Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse.ts";
import UserService from "./users.service.ts";
import { SearchUsersQuery, UpdateProfileInput } from "./users.validator.ts";

class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  getById = async (req: Request, res: Response) => {
    const user = await this.userService.getById(req.params.id as string);
    res.status(200).json(new ApiResponse(200, "User fetched successfully", { user }));
  };

  updateMe = async (req: Request, res: Response) => {
    const data = req.body as UpdateProfileInput;
    const user = await this.userService.updateProfile(req.user!.id, data);
    res.status(200).json(new ApiResponse(200, "Profile updated successfully", { user }));
  };

  search = async (req: Request, res: Response) => {
    const { q } = req.query as unknown as SearchUsersQuery;
    const users = await this.userService.search(q);
    res.status(200).json(new ApiResponse(200, "Users fetched successfully", { users }));
  };
}

export default UserController;
