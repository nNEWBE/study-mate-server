class AppError extends Error {
    public statusCode: number;
    public path: string;

    constructor(path: string, statusCode: number, message: string, stack = '') {
        super(message);
        this.path = path;
        this.statusCode = statusCode;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;