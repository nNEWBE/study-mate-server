import jwt from 'jsonwebtoken';

export const createToken = (
    jwtPayload: object,
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn,
    });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as jwt.JwtPayload;
};
