const mongoose = require('mongoose');
const validate = require('mongoose-validator');



const MessageSchema = mongoose.Schema({
    conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender:     { type: String },
    receiver:   { type: String },
    message: [
        {
            sender_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            receiver_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            sendername:     { type: String },
            receivername:   { type: String },
            body:           { type: String, default: '' },
            isRead:         { type: String, default: false },
            createdAt:      { type: Date, default: Date.now() }
        }
    ]
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
