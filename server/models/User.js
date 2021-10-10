const mongoose = require("mongoose")

// Define user schema in mongodb
const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6
        },
        profilePicture: {
            type: String,
            default: ""
        },
        hobbies: {
            type: Array,
            default: []
        },
        matches: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", UserSchema)