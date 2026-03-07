import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.register(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = await userService.login(req.body);

        res.json({
            success: true,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.getProfile((req as any).user.id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};