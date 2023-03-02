const mongoose = require("mongoose")

const Schema = mongoose.Schema;

let commentSchema = new Schema ({
    message_id: {type: String}, //link to Message
    user: {type: String}, //whose
    text: {type: String}
});

module.exports = mongoose.model("comment", commentSchema);