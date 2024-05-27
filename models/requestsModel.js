const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const ConversationInfo = require('./conversationsModel')

// Define the ChangeRequest schema
const RequestSchema = new mongoose.Schema({
    requestID: {
        type: String,
        default: ''
    },
    conversationID: {
        type: String,
        default: ''
    },
    requestersID: {
        type: String,
        default: ''
    },
    currentName: {
        type: String,
        default: ''
    },
    newName: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

RequestSchema.statics.createRequest = async (requestID, conversationID, requestersID, currentName, newName, status) => {
    // Validation
    if (!requestID || !conversationID || !requestersID || !currentName || !newName || !status) {
        throw new Error('All fields must be filled');
    }

    const requestIDExists = await RequestModel.findOne({ requestID });
    if (requestIDExists) {
        throw Error('Email already in use');
    }

    try {
        // Create the request
        const request = await RequestModel.create({
            requestID,
            conversationID,
            requestersID,
            currentName,
            newName,
            status
        });

        return request;
    } catch (error) {
        throw new Error('Failed to create request: ' + error.message);
    }
};

// get requests made by the user id
RequestSchema.statics.getRequestsForUser = async function (userId) {
    try {
        const requests = await RequestModel.find({ requestersID: userId });
        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get the requests for the conversations where the user id is the admin
RequestSchema.statics.getRequestsForAdmin = async function (userId) {
    try {
        // Step 1: Get conversations created by the user
        const conversations = await ConversationInfo.getConversationsCreatedByUser(userId);

        // Extract conversation IDs
        const conversationIDs = conversations.map(conversation => conversation.conversationID);

        // Step 2: Find requests related to those conversation IDs
        const requests = await RequestModel.find({ conversationID: { $in: conversationIDs } });
        
        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
};

RequestSchema.statics.updateRequestStatus = async function (requestId, status) {
    try {
    
        const updatedRequest = await this.findOneAndUpdate(
            { requestID: requestId },
            { status: status },
            { new: true }
        );

        if (!updatedRequest) {
            throw new Error('Request not found');
        }

        return updatedRequest;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Create a model from the schema
const RequestModel = mongoose.model('Requests', RequestSchema);
module.exports = RequestModel;
