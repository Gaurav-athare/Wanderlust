class ExpressError extends Error {
    constructor(StatusCode, message) {
        super(message); // Pass the message to the base Error class
        this.StatusCode = StatusCode; // Correctly assign the status code
    }
}

module.exports = ExpressError;
