import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import status from 'http-status';

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        let token: string | undefined;

        // Extract token from Bearer header
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        const cookies = (req as any).cookies;

        // Fallback to refresh token from cookies if no Bearer token
        if (!token) {
            token = cookies?.refreshToken;
        }

        if (!token) {
            throw new AppError('auth', status.UNAUTHORIZED, 'You are not authorized!');
        }

        try {
            const secret =
                cookies?.refreshToken && !authHeader
                    ? config.jwt_refresh_secret
                    : config.jwt_access_secret;

            const decoded = jwt.verify(token, secret as string) as JwtPayload;

            const { role, userId } = decoded;

            const user = await User.findOne({ email: userId, isBlocked: false });

            if (!user) {
                throw new AppError('auth', status.NOT_FOUND, 'This user is not found!');
            }

            if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
                throw new AppError('auth', status.UNAUTHORIZED, 'You are not authorized!');
            }

            req.user = {
                _id: user._id,
                email: user.email,
                role: user.role,
            } as JwtPayload;

            next();
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return next(
                    new AppError(
                        'auth',
                        status.UNAUTHORIZED,
                        'Token has expired! Please login again.',
                    ),
                );
            }
            return next(new AppError('auth', status.UNAUTHORIZED, 'Invalid token!'));
        }
    });
};

export default auth;
