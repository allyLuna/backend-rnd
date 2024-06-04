const mongoose = require('mongoose');
const { Schema } = mongoose;
//const bcrypt = require('bcrypt');
const validator = require('validator'); // Make sure you have installed validator using npm install validator

const userInfoSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    preferredLanguage: {
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }
});

userInfoSchema.set('_id', 'userID');

userInfoSchema.statics.signup = async function (userID, email, username, firstName, lastName, password, location, preferredLanguage) {
    
    // validation 
    if (!userID || !email || !password || !firstName || !lastName || !username || !location || !preferredLanguage || !preferredLanguage.code || !preferredLanguage.name) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    // check if username and email are not yet in use
    const emailExists = await this.findOne({ email });
    if (emailExists) {
        throw Error('Email already in use');
    }

    const unExists = await this.findOne({ username });
    if (unExists) {
        throw Error('Username already in use');
    }

    const uidExists = await this.findOne({ userID });
    if (uidExists) {
        throw Error('Username already in use');
    }

    // create user
    const user = await this.create({
        userID,
        email,
        username,
        firstName,
        lastName,
        password,
        location,
        preferredLanguage
    });

    return user;
};


// static login method
userInfoSchema.statics.login = async function (email, password) {
    // Validation
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect Email');
    }

    // Compare the provided password with the password stored in the database
    if (password !== user.password) {
        throw Error('Incorrect Password');
    }

    return user;
};

// fetch all users 
userInfoSchema.statics.getAllUsers = async function () {
    try {
        const users = await this.find({});
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

userInfoSchema.statics.updateUserInfo = async function (userId, newLocation, newPreferredLanguage) {
    try {
        const userInfo = await this.findOne({ userID: userId });

        if (!userInfo) {
            throw new Error('User info not found');
        }

        // Update location if provided
        if (newLocation) {
            userInfo.location = newLocation;
        }

        // Update preferred language if provided
        if (newPreferredLanguage) {
            userInfo.preferredLanguage = newPreferredLanguage;
        }

        // Save the updated user info
        await userInfo.save();

        return userInfo;
    } catch (error) {
        throw new Error(error.message);
    }
};



// Create and export the model
const User = mongoose.model('User', userInfoSchema);
module.exports = User;
