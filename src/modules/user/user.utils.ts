import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IUser } from './user.interface';

export const isUserExists = (user: IUser) => {
    if (!user) {
        throw new AppError("user", httpStatus.NOT_FOUND, 'User does not exists !!');
    }
}

export const isUserExistsAndNotBlocked = (user: IUser) => {
    isUserExists(user);
    if (user.isBlocked) {
        throw new AppError("blocked", httpStatus.UNAUTHORIZED, 'User is blocked !!');
    }
}

export const checkBlockUser = (user: IUser, isBlocked: boolean) => {
    isUserExists(user);
    if ((user.isBlocked === true) && (isBlocked === true)) {
        throw new AppError("blocked", httpStatus.UNAUTHORIZED, 'User is already blocked !!');
    }
}
