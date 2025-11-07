


 class ApiError extends Error {

    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        
        if(this.stack) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;


// export class BadRequestError extends Error {

//     constructor(message="Bad request") {
//         super(message, statusCode=400)
//     }
// }

