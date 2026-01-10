import { TDetails, TGenericErrorResponse } from '../interface/error';

const handleGenericError = (err: Error): TGenericErrorResponse => {
    const issues: TDetails[] = [
        {
            path: '',
            message: err.message,
        },
    ];

    const statusCode = 500;

    return {
        statusCode,
        message: 'Generic Error',
        issues,
    };
};

export default handleGenericError;