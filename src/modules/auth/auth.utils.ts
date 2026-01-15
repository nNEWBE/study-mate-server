import jwt, { SignOptions } from 'jsonwebtoken';

export const createToken = (
    jwtPayload: object,
    secret: string,
    expiresIn: SignOptions['expiresIn'],
) => {
    return jwt.sign(jwtPayload, secret, {
        ...(expiresIn !== undefined && { expiresIn }),
    });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as jwt.JwtPayload;
};
