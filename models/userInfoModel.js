const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
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
}, { timestamps: true });


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

    // password hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create user
    const user = await this.create({
        userID,
        email,
        username,
        firstName,
        lastName,
        password: hash,
        location,
        preferredLanguage
    });

    return user;
};


// static login method
userInfoSchema.statics.login = async function (email, password){
    
    // validation 
    if(!email || !password ){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })
    
    if(!user){
        throw Error('Incorrect Username')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Incorrect password')
    }

    return user

}


// Create and export the model
const User = mongoose.model('User', userInfoSchema);
module.exports = User;
