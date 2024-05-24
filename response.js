// RESPONSES

// SignupReponse
const createSignupResponse = (statusCode, message, userId = null) => {
    return {
        statusCode: statusCode,
        message: message,
        userId: userId
    };
};
// LoginResponse
const loginResponse = (statusCode, message, userId = null) => {
    return {
        statusCode: statusCode,
        message: message,
        userId: userId
    };
};


module.exports = {
    createSignupResponse,
    loginResponse
}