import { Request, Response } from "express";
import ApiError from "../../utils/apiError.ts";
import ApiResponse from "../../utils/apiResponse.ts";
import { clearRefreshCookie, REFRESH_COOKIE_NAME, setRefreshCookie } from "../../utils/cookies.ts";
import AuthService from "./auth.service.ts";
import { LoginInput, RegisterInput } from "./auth.validator.ts";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response) => {
    const input = req.body as RegisterInput;
    const { user, accessToken, refreshToken } = await this.authService.register(input);

    setRefreshCookie(res, refreshToken);
    res
      .status(201)
      .json(new ApiResponse(201, "Account created successfully", { user, accessToken }));
  };

  login = async (req: Request, res: Response) => {
    const input = req.body as LoginInput;
    const { user, accessToken, refreshToken } = await this.authService.login(input);

    setRefreshCookie(res, refreshToken);
    res.status(200).json(new ApiResponse(200, "Logged in successfully", { user, accessToken }));
  };

  refresh = async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const { accessToken, refreshToken } = await this.authService.refresh(incomingRefreshToken);

    setRefreshCookie(res, refreshToken);
    res.status(200).json(new ApiResponse(200, "Token refreshed", { accessToken }));
  };

  logout = async (req: Request, res: Response) => {
    const logoutEverywhere = req.body?.everywhere === true;
    const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    await this.authService.logout(incomingRefreshToken, logoutEverywhere);

    clearRefreshCookie(res);
    res.status(200).json(new ApiResponse(200, "Logged out successfully"));
  };

  me = async (req: Request, res: Response) => {
    // authenticate middleware guarantees req.user is set
    const user = await this.authService.getMe(req.user!.id);
    res.status(200).json(new ApiResponse(200, "Current user", { user }));
  };
}

export default AuthController;
