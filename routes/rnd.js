const express = require('express')

const { 
    createUser,
    loginUser
} = require ('../controllers/rndController')

const router = express.Router()


router.post('/signup-user', createUser) // Signup 

router.post('/login-user', loginUser)   // Login

module.exports = router