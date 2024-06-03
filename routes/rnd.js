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
    checkIfExistingConversation,
    deleteMessagesByConversationID
} = require ('../controllers/rndController')

const router = express.Router()

// POST METHODS
router.post('/signup-user', createUser) // Signup 
router.post('/login-user', loginUser)   // Login
router.post('/create-message', createMessage)   // new message
router.post('/create-conversation', createConversation)   // new conversation
router.post('/create-request', createRequests)   // New request

// FETCH METHODS
router.get('/fetch-all-users', fetchAllUsers)  // fetch all users
router.post('/fetch-conversations', fetchConversations) // fetch all conversations by user id
router.get('/fetch-messages/:conversationID', fetchMessages)  // fetch messages by conversation id
router.post('/fetch-request-admin', fetchRequestsForAdmin)   // fetch requests for admin
router.post('/fetch-request-users', fetchRequestsForUser)   // fetch requests for users
router.post('/fetch-unread-messages', fetchUnreadMessagesForUser)   // fetch unread messages for user id
router.post('/checkConversation', checkIfExistingConversation)   // checks if conversation exists by participants
router.get('/fetch-last-message/:conversationID', fetchLastMessage); // fetch last message for conversation id
router.get('/fetch-last-message-status/:conversationID', fetchLastMessageStatus); // fetch last message status for each recipients


// UPDATE METHODS - PATCH
router.patch('/update-last-activity', updateLastActivity); // update last activity of conversations
router.patch('/update-conversation-name', updateConversationName); // update conversation name
router.patch('/update-message-status', updateMessageStatus); // update message status for every message id
router.patch('/update-request-status', updateRequestStatus); // update request status
router.patch('/update-user-info', updateUserInfo); // update user info - language and location
router.patch('/remove-participant', removeParticipant); // removes participant : leave group chat


// DELETE 
router.delete('/delete-conversation', deleteConversation) // delete conversation by conversation id
router.delete('/delete-messages-for-conversation', deleteMessagesByConversationID) // delete messages for conversation id

module.exports = router