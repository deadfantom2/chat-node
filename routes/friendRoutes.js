const express       = require('express');

const User          = require('../models/user');


const authVerify    = require('../middleware/auth-middleware');

const app = express();


app.post('/follow-user', authVerify.VerifyToken, async function(req, res) {

    const followingUser = await User.update({_id: req.user._id, 'following.userFollowed': {$ne: req.body.userFollowed}},{
        $push: {
            following: {
                userFollowed: req.body.userFollowed
            }
        }
    });
    const followersUser = await User.update({_id: req.body.userFollowed, 'following.follower': {$ne: req.user._id}},{
        $push: {
            followers: {
                follower: req.user._id
            },
            notifications: {
                sender_id: req.user._id,
                message: req.user.username + ' is now following you',
                created: new Date(),
                viewProfile: false
            }
        }
    });
    res.status(200).json({success: true, message: 'Following user now', followingUser: followingUser, followersUser: followersUser})

});


app.post('/unfollow-user', authVerify.VerifyToken, async function(req, res) {

    const followingUser = await User.update({_id: req.user._id},{
        $pull: {
            following: {
                userFollowed: req.body.userFollowed
            }
        }
    });
    const followersUser = await User.update({_id: req.body.userFollowed},{
        $pull: {
            followers: {
                follower: req.user._id
            }
        }
    });
    res.status(200).json({success: true, message: 'Following user now', followingUser: followingUser, followersUser: followersUser})

});

app.post('/mark/:id', authVerify.VerifyToken, async function(req, res) {

    const id = req.params.id;

    if(!req.body.deleteValue){
        const markNotifi = await User.updateOne({_id: req.user._id, 'notifications._id': id},{
            $set: {'notifications.$.read': true}
        });
        res.status(200).json({success: true, message: "Marked as read"});
    }else{
        const deleteNotifi = await User.update({_id: req.user._id, 'notifications._id': id}, {
            $pull: {
                notifications: { _id: id}
            }
        });
        res.status(200).json({success: true, message: "Delete notifi successfully!"})
    }

});

app.post('/mark-all', authVerify.VerifyToken,  async function(req, res) {

    console.log(req.user._id)

    // const markAll = await User.update({_id: req.user._id},
    //     {$set: {'notifications.$[elem].read': true}},
    //     {arrayFilters: [{'elem.read': false}], multi: true}
    // );
    // res.status(200).json({success: true, message: "Marked all successfully"});



    const markAll = await User.update(
        {_id: req.user._id },
        { $set: { 'notifications.$[elem].read': true } },
        { arrayFilters: [{ 'elem.read': false }], multi: true }
        ).then(() => {
        res.status(200).json({ message: 'Marked all successfully' });
    }).catch(err => {res.status(500).json({ message: 'Error occured' });      });


    // const markAll =  User.update({_id: req.user._id},
    //     { $set: { "notifications.$[elem].read": true } },
    //     { arrayFilters: [ { "elem.read": false}], multi: true}
    //   ).then(function(){
    //       res.status(200).json({success: true, message: "Marked all successfully"});
    //   }).catch(function(err){
    //       res.status(500).json({success: true, message: err});
    //   });
    // res.status(200).json({success: true, message: "Marked all successfully",markAll: markAll});

    // console.log(markAll)



});

module.exports = app;
