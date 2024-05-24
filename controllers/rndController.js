const mongoose = require('mongoose');
const UserInfo = require('../models/userInfoModel');
const jwt = require('jsonwebtoken');
const { 
    createSignupResponse,
    loginResponse
 } = require('../response');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '3d'}); 
};


// Signup New User
const createUser = async (req, res) => {
    const { userID, email, username, firstName, lastName, password, location, preferredLanguage } = req.body;

    // Add user to database
    try {
        const user = await UserInfo.signup(userID, email, username, firstName, lastName, password, location, preferredLanguage);

        // Create token
        const token = createToken(user._id);

        // Create signup response
        const signupResponse = createSignupResponse(200, "success", user.userID);

        // Send the response
        res.status(200).json(signupResponse);
    } catch (error) {
        // Handle errors and create an error response object
        const errorResponse = createSignupResponse(400, error.message);

        // Send the error response
        res.status(400).json(errorResponse);
    }
};

// Login User 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserInfo.login(email, password);

        const token = createToken(user._id);

        const createloginResponse = loginResponse(200, "success", user.userID);

        res.status(200).json(createloginResponse);
    } catch (error) {
        const errorResponse = loginResponse(400, error.message);
        res.status(400).json(errorResponse);
    }
};

module.exports = {
    createUser,
    loginUser
};
