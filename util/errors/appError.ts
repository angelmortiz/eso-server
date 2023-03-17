class AppError extends Error {
    status: 'fail' | 'error'
    statusCode: number;
    isOperational: boolean = false;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
        console.log(this.stack);
    }
}

export default AppError;