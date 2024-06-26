const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;


const MessagesSchema = new Schema({
    messageID: {
        type: String,
        default: ''
    },
    conversationID: {
        type: String,
        default: ''
    },
    senderID: {
        type: String,
        default: ''
    },
    recipientID: {
        type: [String],
        default: []
    },
    content: {
        originalContent: {
            type: String,
            default: ''
        },
        translatedContent: {
            type: String,
            default: ''
        },
        profanity: {
            detected: {
                type: Boolean,
                default: false
            },
            censoredContent: {
                type: String,
                default: null
            }
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: [{
        recipientID: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    }]
});

MessagesSchema.set('_id', 'messageID');

MessagesSchema.statics.createMessage = async function (messageID, conversationID, senderID, recipientID, content, status) {
    // Validation 
    if (!messageID || !conversationID || !senderID || !recipientID || !content || !status) {
        throw new Error('All fields must be filled');
    }
    
    // Check if messageID already exists
    const messageExists = await this.findOne({ messageID });
    if (messageExists) {
        throw new Error('Message ID already in use');
    }

    // Create message
    const message = await this.create({
        messageID,
        conversationID,
        senderID,
        recipientID,
        content,
        status
    });

    return message;
};



// MessagesSchema.statics.getMessages = async function (conversationId) {
//     try {
//         const messages = await this.find({ conversationID: conversationId });

//         // Check if the messages array is empty and return an empty array if true
//         if (messages.length === 0) {
//             console.log(`No messages found for conversationID: ${conversationId}`);
//             return [];
//         }

//         return messages;
//     } catch (error) {
//         console.error(`Error fetching messages for conversationID: ${conversationId}`, error);
//         throw new Error(error.message);
//     }
// };

MessagesSchema.statics.getMessages = async function (conversationId, limit, offset, sortBy, order) {
    try {
        // Validate limit and offset
        limit = parseInt(limit, 10);
        offset = parseInt(offset, 10);
        if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0) {
            throw new Error("Invalid limit or offset");
        }

        // Prepare sorting criteria
        let sortCriteria = {};
        if (sortBy && order) {
            sortCriteria[sortBy] = order === 'asc' ? 1 : -1;
        } else {
            // Default sorting by timestamp in descending order if not specified
            sortCriteria.timestamp = -1;
        }

        // Fetch total count of messages
        const totalMessages = await this.countDocuments({ conversationID: conversationId });

        // Fetch paginated messages with dynamic sorting
        const messages = await this.find({ conversationID: conversationId })
                                   .sort(sortCriteria)
                                   .skip(offset)
                                   .limit(limit);

        // Check if the messages array is empty and return an empty array if true
        if (messages.length === 0) {
            console.log(`No messages found for conversationID: ${conversationId}`);
            return { messages: [], totalMessages };
        }

        return { messages, totalMessages };
    } catch (error) {
        console.error(`Error fetching messages for conversationID: ${conversationId}`, error);
        throw new Error(error.message);
    }
};


// Fetch messages for the conversation id
// check the messages if the status for the userid is sent
MessagesSchema.statics.getUnreadMessagesForUser = async function (conversationId, userId) {
    try {
        // Fetch messages for the conversationId
        const messages = await this.find({ conversationID: conversationId });

        // Filter messages where the senderID matches userId, and the status is 'sent' for the user in the status array
        const unreadMessages = messages.filter(message => {
            const isSent = message.status.some(status => status.recipientID === userId && status.status === 'sent');
            return isSent;
        });

        return unreadMessages;
    } catch (error) {
        throw new Error(error.message);
    }
};

MessagesSchema.statics.updateMessageStatus = async function (conversationId, userId) {
    try {
        // Fetch messages for the conversationId
        const messages = await this.find({ conversationID: conversationId });

        // Update status of messages where the recipientID matches userId and status is 'sent'
        const updatedMessages = await Promise.all(messages.map(async (message) => {
            // Check if the message has any status entries for the recipientID equal to userId and status is 'sent'
            const updatedStatus = message.status.map(status => {
                if (status.recipientID === userId && status.status === 'sent') {
                    // If condition is met, update the status to 'seen'
                    return { recipientID: userId, status: 'seen' };
                }
                return status; // Otherwise, keep the status unchanged
            });

            // Update message status in the database
            return await this.findByIdAndUpdate(message._id, { status: updatedStatus }, { new: true });
        }));

        return updatedMessages;
    } catch (error) {
        throw new Error(error.message);
    }
};

MessagesSchema.statics.fetchLastMessage = async function(conversationID) {
    try {
        const message = await this.find({ conversationID })
            .sort({ timestamp: -1 })
            .limit(1);
        
        if (message.length === 0) {
            console.log(`No messages found for conversation ${conversationID}`);
            return " ";
        }
        
        return message;
    } catch (error) {
        console.error(`Error fetching last message: ${error.message}`);
        return "";
    }
};

MessagesSchema.statics.fetchLastMessageStatus = async function(conversationID) {
    try {
        const messages = await this.find({ conversationID })
            .sort({ timestamp: -1 })
            .limit(1);
        
        if (messages.length === 0) {
            console.log(`No messages found for conversation ${conversationID}`);
            return []; // Assuming null indicates no status found
        }

        const message = messages[0];
        const status = message.status;

        return status;
    } catch (error) {
        console.error(`Error fetching last message status: ${error.message}`);
        return null;
    }
};

MessagesSchema.statics.deleteMessagesByConversationID = async function(conversationID) {
    try {
        const result = await this.deleteMany({ conversationID });
        console.log(`Deleted ${result.deletedCount} messages for conversation ${conversationID}`);
        return result.deletedCount;
    } catch (error) {
        console.error(`Error deleting messages for conversation ${conversationID}: ${error.message}`);
        throw error;
    }
};


// Create a model from the schema
const MessagesModel = mongoose.model('Messages', MessagesSchema);
module.exports = MessagesModel;
