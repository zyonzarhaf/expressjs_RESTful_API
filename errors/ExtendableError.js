class ExtendableError extends Error {
    constructor({
        message,
        errors,
        status,
        isPublic,
        isOperational,
        stack
    }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.errors = errors;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = isOperational;
        this.stack = stack;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ExtendableError;
