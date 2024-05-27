
const mongoose = require('mongoose');
const UserInfo = require('../models/userInfoModel');
const MessageInfo = require('../models/messagesModel');
const ConversationInfo = require('../models/conversationsModel')
const RequestInfo = require('../models/requestsModel')
const jwt = require('jsonwebtoken');


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '3d'}); 
};



// POST METHODS - CREATE --------------------------------------------

// Signup New User
const createUser = async (req, res) => {
    const { userID, email, username, firstName, lastName, password, location, preferredLanguage } = req.body;

    // Add user to database
    try {
        const user = await UserInfo.signup(userID, email, username, firstName, lastName, password, location, preferredLanguage);

        // Create token
        const token = createToken(user._id);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: user
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Login User 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserInfo.login(email, password);

        const token = createToken(user._id);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            userId: user.userID
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// New Message
const createMessage = async (req, res) => {
    const { messageID, conversationID, senderID, recipientID, content, status } = req.body;

    try {
        // Use the createMessage method of MessagesSchema to create the message
        const message = await MessageInfo.createMessage(messageID, conversationID, senderID, recipientID, content, status);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: message
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// New Conversation
const createConversation = async (req, res) => {
    const { conversationID, participants, conversationTitle, createdBy, conversationType } = req.body;

    try {
        // Use the createMessage method of MessagesSchema to create the message
        const conversation = await ConversationInfo.createConversation(conversationID, participants, conversationTitle, createdBy, conversationType);

        const successResponse = {
            statusCode: 200,
            conversationID: conversationID,
            results: conversation
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Create Requests
const createRequests = async (req, res) => {
    const { requestID, conversationID, requestersID, currentName, newName, status} = req.body;

    try {
        const request = await RequestInfo.createRequest(requestID, conversationID, requestersID, currentName, newName, status);
        
        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: request
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};


// GET METHODS - FETCH --------------------------------------------

// Fetch Users
const fetchAllUsers = async (req, res) => {
    try {
        const users = await UserInfo.getAllUsers();

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: users
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Fetch Conversation 
const fetchConversations = async (req, res) => {
    const { userId } = req.body;

    try {
        const conversations = await ConversationInfo.getConversations(userId);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: conversations
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Fetch Messages 
const fetchMessages = async (req, res) => {
    const { conversationId } = req.body;

    try {
        const messages = await MessageInfo.getMessages(conversationId);
        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: messages
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Fetch Requests For User 
const fetchRequestsForUser = async (req, res) => {
    const { requestersID } = req.body;

    try {
        const requests = await RequestInfo.getRequestsForUser(requestersID);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: requests
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Fetch Requests For Admin 
const fetchRequestsForAdmin = async (req, res) => {
    const { createdBy } = req.body;

    try {
        const requests = await RequestInfo.getRequestsForAdmin(createdBy);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: requests
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Fetch Unread Messages
const fetchUnreadMessagesForUser = async (req, res) => {
    const { conversationId, userId } = req.body;

    try {
        // Use the static method to get unread messages
        const unreadMessages = await MessageInfo.getUnreadMessagesForUser(conversationId, userId);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: unreadMessages
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Update Last Acitivity
const updateLastActivity = async (req, res) => {
    const { conversationId } = req.body;
    
    try {
        // Call the static method to update last activity
        const conversations = await ConversationInfo.updateLastActivity(conversationId);
        
        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: conversations
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Update Conversation Name
const updateConversationName = async (req, res) => {
    const { conversationId, conversationTitle } = req.body;
    
    try {
        // Call the static method to update last activity
        const conversations = await ConversationInfo.updateConversationName(conversationId, conversationTitle);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: conversations
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Update Message Status
const updateMessageStatus = async (req, res) => {
    const { conversationId, userId } = req.body;

    try {
        // Call the static method to update message status
        const updatedMessages = await MessageInfo.updateMessageStatus(conversationId, userId);

        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: updatedMessages
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Update Request Status
const updateRequestStatus = async (req, res) => {
    const { requestID, status } = req.body;
    
    try {
        // Call the static method to update last activity
        const request = await RequestInfo.updateRequestStatus(requestID, status);
        const successResponse = {
            statusCode: 200,
            message: "Success",
            results: request
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Update User Info
const updateUserInfo = async (req, res) => {
    const { userId, newLocation, newPreferredLanguage } = req.body;

    try {

        const updatedUserInfo = await UserInfo.updateUserInfo(userId, newLocation, newPreferredLanguage);
        
        const successResponse = {
            statusCode: 200,
            message: "User info updated successfully",
            results: updatedUserInfo
        };
        res.status(200).json(successResponse);
    } catch (error) {

        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};


// Delete Conversation
const deleteConversation = async (req, res) => {
    const { conversationId } = req.body;

    try {
        const deletedConversation = await ConversationInfo.deleteConversation(conversationId);

        const successResponse = {
            statusCode: 200,
            message: "Conversation deleted successfully",
            results: deletedConversation
        };
        res.status(200).json(successResponse);
    } catch (error) {
        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Remove Participant
const removeParticipant = async (req, res) => {
    const { participantID, conversationID } = req.body;

    try {
        const updatedConversation = await ConversationInfo.removeParticipantFromConversation(participantID, conversationID);

        const successResponse = {
            statusCode: 200,
            message: "Participant removed successfully",
            results: updatedConversation
        };

        res.status(200).json(successResponse);
    } catch (error) {
        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};

// Fetch Last Message
const fetchLastMessage = async (req, res) => {
    const { conversationID } = req.params;

    try {
        const lastMessage = await MessageInfo.fetchLastMessage(conversationID);
        const successResponse = {
            statusCode: 200,
            message: "Fetched Last Message Successfully",
            results: lastMessage
        };

        res.status(200).json(successResponse);
    } catch (error) {
        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        res.status(400).json(errorResponse);
    }
};


// Fetch Last Message Status
const fetchLastMessageStatus = async (req, res) => {
    const { conversationID } = req.params;

    try {
        const status = await MessageInfo.fetchLastMessageStatus(conversationID);

        const successResponse = {
            statusCode: 200,
            message: "Fetched Last Message Status Successfully",
            results: status
        };

        res.status(200).json(successResponse);
    } catch (error) {
        const errorResponse = {
            statusCode: 400,
            message: error.message
        };
        
        res.status(400).json(errorResponse);
    }
};

module.exports = {
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
    fetchLastMessageStatus
};
