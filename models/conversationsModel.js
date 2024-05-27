const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const ConversationSchema = new mongoose.Schema({
    conversationID: {
        type: String,
        default: ''
    },
    participants: {
        type: [String],
        default: []
    },
    conversationTitle: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAt => createdAt.toLocaleString()
    },
    lastActivity: {
        type: Date,
        default: Date.now,
        get: lastActivity => lastActivity.toLocaleString()
    },
    createdBy: {
        type: String,
        default: ''
    },
    conversationType: {
        type: String,
        default: ''
    }
});

ConversationSchema.set('_id', 'conversationID');

ConversationSchema.statics.createConversation = async (conversationID, participants, conversationTitle, createdBy, conversationType) => {
    // Validation
    if (!conversationID || !participants || !conversationTitle || !createdBy || !conversationType) {
        throw new Error('All fields must be filled');
    }

    const conversationIDExists = await ConversationModel.findOne({ conversationID });
    if (conversationIDExists) {
        throw Error('ConversationID already in use');
    }

    try {
        // Create conversation
        const conversation = await ConversationModel.create({
            conversationID,
            participants,
            conversationTitle,
            createdBy,
            conversationType
        });

        return conversation;
    } catch (error) {
        throw new Error('Failed to create conversation: ' + error.message);
    }
};

ConversationSchema.statics.getConversations = async function (userId) {
    try {
        const conversations = await this.find({ participants: userId });
        return conversations;
    } catch (error) {
        throw new Error(error.message);
    }
};

ConversationSchema.statics.getConversationsCreatedByUser = async function (userId) {
    try {
        const conversations = await this.find({ createdBy: userId });
        return conversations;
    } catch (error) {
        throw new Error(error.message);
    }
};

ConversationSchema.statics.updateLastActivity = async function (conversationId) {
    try {
        const currentDate = new Date().toLocaleString();

        const updatedConversation = await this.findOneAndUpdate(
            { conversationID: conversationId },
            { lastActivity: currentDate },
            { new: true }
        );

        if (!updatedConversation) {
            throw new Error('Conversation not found');
        }

        return updatedConversation;
    } catch (error) {
        throw new Error(error.message);
    }
};

ConversationSchema.statics.updateConversationName = async function (conversationId, name) {
    try {
    
        const updatedConversation = await this.findOneAndUpdate(
            { conversationID: conversationId },
            { conversationTitle: name },
            { new: true }
        );

        if (!updatedConversation) {
            throw new Error('Conversation not found');
        }

        return updatedConversation;
    } catch (error) {
        throw new Error(error.message);
    }
};

ConversationSchema.statics.deleteConversation = async function (conversationId) {
    try {
        // Find the conversation by its ID and delete it
        const deletedConversation = await this.findOneAndDelete({ conversationID: conversationId });

        if (!deletedConversation) {
            throw new Error('Conversation not found');
        }

        return deletedConversation;
    } catch (error) {
        throw new Error(error.message);
    }
};

ConversationSchema.statics.removeParticipantFromConversation = async function (participantID, conversationID) {
    try {
        // Find the conversation by its ID
        const conversation = await this.findOne({ conversationID });

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        let { participants, conversationTitle, createdBy } = conversation;

        // Remove the participant from the participants list
        const index = participants.indexOf(participantID);
        if (index !== -1) {
            participants.splice(index, 1);
        }

        // Update the participants list in the conversation
        conversation.participants = participants;

        // If the removed participant is the creator, assign a new creator
        if (createdBy === participantID) {
            if (participants.length > 0) {
                conversation.createdBy = participants[0];
            } else {
                throw new Error('No participants left in the conversation to assign as creator');
            }
        }

        // Function to get participant names (replace with actual logic to get names)
        const getParticipantName = (id) => {
            // Placeholder function to get participant name by ID
            return 'ParticipantName'; // Replace with actual logic
        };

        const participantToRemove = getParticipantName(participantID);

        // Remove the name of the participant who left from the conversation title
        const searchString = `${participantToRemove}, `;
        const searchStringForEnd = `, ${participantToRemove}`;

        if (conversationTitle.includes(searchString)) {
            conversationTitle = conversationTitle.replace(searchString, '');
        } else if (conversationTitle.includes(searchStringForEnd)) {
            conversationTitle = conversationTitle.replace(searchStringForEnd, '');
        }

        // Update the conversation title
        conversation.conversationTitle = conversationTitle;

        // Save the updated conversation
        await conversation.save();

        return conversation;
    } catch (error) {
        throw new Error(`Failed to remove participant: ${error.message}`);
    }
};



// Create a model from the schema
const ConversationModel = mongoose.model('Conversations', ConversationSchema);
module.exports = ConversationModel;
