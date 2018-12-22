const express       = require('express');
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');

const User          = require('../models/user');
const Post          = require('../models/post');
const config        = require('../config/config');
const authVerify    = require('../middleware/auth-middleware');

const app = express();


app.get('/posts', authVerify.VerifyToken, async function(req, res) {

    try{
        const postAll = await Post.find({}).populate('user_id').sort({created: -1});
        const postTopAll = await Post.find({ totalLikes: {$gte: 2}}).populate('user_id').sort({created: -1});
        res.status(200).json({success: true, message: 'All posts', posts: postAll, posttop: postTopAll})

    }catch(err){
        res.status(500).json({success: true, message: 'Error occured'})
    }
});

app.get('/post/:id', authVerify.VerifyToken, async function(req, res) {

    const id = req.params.id;

    try{
        const postOne= await Post.findOne({_id: id}).populate('user_id').populate('comments.user_id');
        res.status(200).json({success: true, message: 'One post', post: postOne})

    }catch(err){
        res.status(500).json({success: true, message: 'Error occured'})
    }
});

app.post('/add', authVerify.VerifyToken, async function(req, res) {

    const body = {
        user_id: req.user._id,
        username: req.user.username,
        post: req.body.post,
        created: new Date()
    };
    const createPost = await Post.create(body);
    const updatePostUser = await User.update({_id: req.user._id}, {
        $push: {
            posts: {
                post_id: createPost._id,
                post: req.body.post,
                created: new Date()
            }
        }
    });
    res.status(200).json({success: true, message: 'Post created!', post: createPost});
});

app.post('/add-like', authVerify.VerifyToken, async function(req, res) {

    const post_id = req.body._id;

    await Post.update({_id: post_id, 'likes.username': { $ne: req.user.username}}, {  //ne interdiction d'ecrire 2eme fois
       $push: { likes: { username: req.user.username }},
       $inc: { totalLikes: 1}
    }).then(()=>{
        res.status(200).json({success: true, message: 'You liked the post'});
    });

});

app.post('/add-comment', authVerify.VerifyToken, async function(req, res) {

    console.log(req.body)
    console.log(req.user._id)
    console.log(req.user.username)

    const post_id = req.body.post_id;

    await Post.update({_id: post_id}, {  //ne interdiction d'ecrire 2eme fois
        $push: { comments: {
            user_id: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: new Date()
        }}
    }).then(()=>{
        res.status(200).json({success: true, message: 'Comment added to post!'});
    });

});


module.exports = app;
