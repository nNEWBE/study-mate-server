import { ZodError } from 'zod';
import { TGenericErrorResponse, TDetails } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const issues: TDetails[] = err.issues.map((issue) => {
        return {
            path: issue?.path[issue.path.length - 1]?.toString() || "unknown",
            message: issue.message,
        };
    });

    const statusCode = 400;

    return {
        statusCode,
        message: 'Zod Validation Error',
        issues,
    };
};

export default handleZodError;