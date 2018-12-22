const express       = require('express');

const User          = require('../models/user');


const authVerify    = require('../middleware/auth-middleware');

const app = express();


app.get('/users', authVerify.VerifyToken, async function(req, res) {

    try{
        const userAll = await User.find({}).populate('posts.post_id').populate('following.userFollowed').populate('followers.follower');
        res.status(200).json({success: true, message: 'All users', users: userAll})

    }catch(err){
        res.status(500).json({success: true, message: 'Error occured'})
    }
});


app.get('/user/:id', authVerify.VerifyToken, async function(req, res) {

    const id= req.params.id;

    try{
        const userAll = await User.findOne({_id: id}).populate('posts.post_id').populate('following.userFollowed').populate('followers.follower');
        res.status(200).json({success: true, message: 'User by id', users: userAll})

    }catch(err){
        res.status(500).json({success: true, message: 'Error occured'})
    }

});


app.get('/username/:username', authVerify.VerifyToken, async function(req, res) {

    const username= req.params.username;

    try{
        const userAll = await User.findOne({username: username}).populate('posts.post_id').populate('following.userFollowed').populate('followers.follower');
        res.status(200).json({success: true, message: 'User by username', users: userAll})

    }catch(err){
        res.status(500).json({success: true, message: 'Error occured'})
    }
});

module.exports = app;
