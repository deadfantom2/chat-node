const express       = require('express');
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');

const User          = require('../models/user');
const Message          = require('../models/message');
const Conversation          = require('../models/conversation');
const config        = require('../config/config');
const authVerify    = require('../middleware/auth-middleware');

const app = express();



app.post('/chat-message/:sender_id/:receiver_id', authVerify.VerifyToken, async function(req, res) {

    console.log(req.body);

    const senderId = req.params.sender_id;
    const receiverId = req.params.receiver_id;

    Conversation.find({
        $or: [
            {
                participants: {
                    $elemMatch: { sender_id: senderId, receiver_id: receiverId }
                }
            },
            {
                participants: {
                    $elemMatch: { sender_id: receiverId, receiver_id: senderId }
                }
            }
        ]}, async (err, result) => {
            if(result.length > 0){
            // console.log("result: ", result)
            }else{
                const newConversation = new Conversation();
                        newConversation.participants.push({
                            sender_id: req.user._id,
                            receiver_id: req.params.receiver_id
                        });

                        const saveConversation = await newConversation.save();
                        console.log(saveConversation)
            }
    });


});



// app.post('/chat-message/:sender_id/:receiver_id', authVerify.VerifyToken, async function(req, res) {
//
//     console.log(req.body);
//
//     const senderId = req.params.sender_id;
//     const receiverId = req.params.receiver_id;
//
//     Conversation.find({
//         $or: [
//                 {
//                     participants: {
//                         $elemMatch: { sender_id: senderId, receiver_id: receiverId }
//                     }
//                 },
//                 {
//                     participants: {
//                         $elemMatch: { sender_id: receiverId, receiver_id: senderId }
//                     }
//                 }
//         ]
//     }, async (err, result) => {
//         if(result.length > 0){
//             // console.log("result: ", result)
//         }else{
//             const newConversation = new Conversation();
//             newConversation.participants.push({
//                 sender_id: req.user._id,
//                 receiver_id: receiverId
//             });
//             const saveConversation = await newConversation.save();
//             console.log("saveConversation - save : ", saveConversation)
//
//             const newMessage = new Message();
//                 newMessage.conversation_id = saveConversation._id;
//                 newMessage.sender = req.user.username;
//                 newMessage.receiver = req.body.receiverName;  //receiveName cote angulat
//                 newMessage.message.push({
//                     sender_id: req.user._id,
//                     receiver_id: receiverId,
//                     sendername: req.user.username,
//                     receivername: req.body.receivername,
//                     body: req.body.message
//                 });
//
//                 await User.update({_id: req.user._id}, {
//                     $push: {
//                         chatList: {
//                             $each: [{
//                                 receiver_id: receiverId,
//                                 message_id: newMessage._id
//                             }],
//                             $position: 0
//                         }
//                     }
//                 });
//
//                 await User.update({_id: receiverId}, {
//                     $push: {
//                         chatList: {
//                             $each: [{
//                                 receiver_id: req.user._id,
//                                 message_id: newMessage._id
//                             }],
//                             $position: 0
//                         }
//                     }
//                 });
//
//
//                 console.log("newMessage: ", newMessage)
//                 await newMessage().save().then(()=> {
//                     res.status(200).json({ success: true, message: "Message sent"})
//                 }).catch(err =>
//                     res.status(500).json({success: false, message: 'Error occured'})
//                 );
//         }
//     });
//
//
// });


module.exports = app;
