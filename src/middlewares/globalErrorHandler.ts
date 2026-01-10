/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import httpStatus from 'http-status';
import { TDetails } from '../interface/error';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import mongoose from 'mongoose';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import handleGenericError from '../errors/handleGenericError';
import { errorMessage } from '../interface/error.constants';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

    let statusCode = httpStatus.INTERNAL_SERVER_ERROR as number;
    let message = 'Internal Server Error';
    let issues: TDetails[] = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];

    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        issues = simplifiedError?.issues;
    }
    else if (err instanceof mongoose.Error.ValidationError) {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        issues = simplifiedError?.issues;
    }
    else if (err instanceof mongoose.Error.CastError) {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        issues = simplifiedError?.issues;
    }
    else if (err?.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        issues = simplifiedError?.issues;
    }
    else if (err instanceof AppError) {
        const simplifiedError = handleGenericError(err);
        statusCode = simplifiedError?.statusCode;
        message = errorMessage[statusCode as keyof typeof errorMessage] || simplifiedError?.message;
        issues = simplifiedError?.issues;
    }
    else if (err instanceof Error) {
        const simplifiedError = handleGenericError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        issues = simplifiedError?.issues;
    }

    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error: {
            issues
        },
        stack: config.node_env === 'development' ? err?.stack : null,
    });
};

export default globalErrorHandler;