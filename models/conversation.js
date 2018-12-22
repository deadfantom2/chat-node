const mongoose = require('mongoose');
const validate = require('mongoose-validator');



const ConversationSchema = mongoose.Schema({
    participants: [
        {
            sender_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            receiver_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ]
});

var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
