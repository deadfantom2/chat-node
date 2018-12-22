const mongoose = require('mongoose');
const validate = require('mongoose-validator');



const PostSchema = mongoose.Schema({
    user_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username:       { type: String, default: '' },
    post:           { type: String, default: '' },
    comments: [{
        user_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username:   { type: String, default: '' },
        comment:    { type: String, default: '' },
        createdAt:  { type: Date,   default: Date.now()}
    }],
    totalLikes:     { type: Number, default: 0 },
    likes: [{
        username:   { type: String, default: '' }
    }],
    created:        { type: Date, default: Date.now() }
  });

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
