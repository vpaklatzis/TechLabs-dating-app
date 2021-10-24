const mongoose = require("mongoose")

// Define conversation schema in mongodb
const ConversationSchema = new mongoose.Schema({
        members: {
            type: Array
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Conversation", ConversationSchema)