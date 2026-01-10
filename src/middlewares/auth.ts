import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import catchAsync from "../utils/catchAsync";

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ success: false, message: "unauthorized access" });
        return;
    }

    jwt.verify(token, config.jwt_access_secret as string, (err: Error | null, decoded: string | JwtPayload | undefined) => {
        if (err) {
            return res.status(401).json({ success: false, message: "unauthorized access" });
        }
        req.user = decoded as JwtPayload;
        next();
    });
});

export default auth;
