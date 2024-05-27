const express = require('express')

const { 
    createUser,
    loginUser, 
    fetchAllUsers,
    createMessage, 
    createConversation, 
    createRequests, 
    fetchConversations, 
    fetchMessages,
    fetchRequestsForAdmin, 
    fetchRequestsForUser, 
    fetchUnreadMessagesForUser, 
    updateLastActivity, 
    updateConversationName, 
    updateMessageStatus, 
    updateRequestStatus, 
    updateUserInfo, 
    deleteConversation, 
    removeParticipant, 
    fetchLastMessage, 
    fetchLastMessageStatus, 
    checkIfExistingConversation
} = require ('../controllers/rndController')

const router = express.Router()

// POST METHODS
router.post('/signup-user', createUser) // Signup 
router.post('/login-user', loginUser)   // Login
router.post('/create-message', createMessage)   // new message
router.post('/create-conversation', createConversation)   // new conversation
router.post('/create-request', createRequests)   // New request

// FETCH METHODS
router.get('/fetch-all-users', fetchAllUsers)   // Fetch all users
router.post('/fetch-conversations', fetchConversations)   // Fetch conversations for the current user
router.post('/fetch-messages', fetchMessages)   // Fetch messages for the conversation
router.post('/fetch-request-admin', fetchRequestsForAdmin)   // Fetch requests for the admin
router.post('/fetch-request-users', fetchRequestsForUser)   // Fetch requests for the users
router.post('/fetch-unread-messages', fetchUnreadMessagesForUser)   // Fetch requests for the users
router.post('/checkConversation', checkIfExistingConversation)   // Fetch requests for the users
router.get('/fetch-last-message/:conversationID', fetchLastMessage);
router.get('/fetch-last-message-status/:conversationID', fetchLastMessageStatus);


// UPDATE METHODS - PATCH
router.patch('/update-last-activity', updateLastActivity);
router.patch('/update-conversation-name', updateConversationName);
router.patch('/update-message-status', updateMessageStatus);
router.patch('/update-request-status', updateRequestStatus);
router.patch('/update-user-info', updateUserInfo);
router.patch('/remove-participant', removeParticipant);


// DELETE 
router.delete('/delete-conversation', deleteConversation)   // Fetch requests for the user


module.exports = router