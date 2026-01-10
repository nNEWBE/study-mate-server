/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { TDetails, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];

    const issues: TDetails[] = [
        {
            path: Object.keys(err.keyValue)[0] || "unknown",
            message: `${extractedMessage} is already exists!`,
        },
    ];

    const statusCode = httpStatus.BAD_REQUEST;
    return {
        statusCode,
        message: 'Duplicate Error',
        issues,
    };
};

export default handleDuplicateError;