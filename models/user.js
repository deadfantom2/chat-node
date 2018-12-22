const mongoose = require('mongoose');
const validate = require('mongoose-validator');

var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

// User E-mail Validator
var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'E-mail is not a valid.'
  }),
  validate({
    validator: 'isLength',
    arguments: [10, 50],
    message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

// Password Validator
var passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [4, 100],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

const UserSchema = mongoose.Schema(
  {
    username:           { type: String, required: true, validate: usernameValidator },
    email:              { type: String, required: true, validate: emailValidator, index: { unique: true }},
    password:           { type: String, required: true, validate: passwordValidator },
    posts: [{
        post_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
        post:           { type: String },
        created:        { type: Date, default: Date.now() }
    }],
    following: [{
        userFollowed:   { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    followers: [{
        follower:       { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    notifications: [{
        sender_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        message:        { type: String},
        viewProfile:    { type: Boolean, default: false},
        created:        { type: Date, default: Date.now()},
        read:           { type: Boolean, default: false},
        date:           { type: String, default: ''}
    }],
    chatList: [
        {
            receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            message_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
        }
    ]
  }
);

var User = mongoose.model('User', UserSchema);
module.exports = User;
