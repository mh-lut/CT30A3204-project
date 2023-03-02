const mongoose = require("mongoose")

const Schema = mongoose.Schema;

let messageSchema = new Schema ({
    user_id: {type: String}, //link to user
    comments_id: {type: [String]}, //id to comments
    user: {type: String}, //whose
    headline: {type: String},
    text: {type: String}, //code snippets
    
});

module.exports = mongoose.model("message", messageSchema);