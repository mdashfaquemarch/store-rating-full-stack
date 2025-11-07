

class ApiResponse {
    constructor(message, statusCode = 200, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400; // boolean indicating success
        if (data !== null) this.data = data;
    }
}


export default ApiResponse;