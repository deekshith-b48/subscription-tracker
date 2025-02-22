const errorMiddleware = (err, req, res, next) => {  // Add `next` parameter
    try {
        let error = { ...err };
        error.message = err.message;
        console.log(err);

        // Mongoose bad object ID
        if (err.name === 'CastError') {
            const message = `Resource not found with id of ${err.value}`;
            error = { message, statusCode: 404 };
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = { message, statusCode: 400 };
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = { message, statusCode: 400 };
        }

        // Ensure `res` is a valid response object
        if (!res || typeof res.status !== 'function') {
            console.error('Invalid response object in error middleware');
            return next(err); // Pass the error to the default Express error handler
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });

    } catch (error) {
        console.error('Unexpected error in errorMiddleware:', error);
        next(error); // Pass the unexpected error to Express
    }
};

export default errorMiddleware;
