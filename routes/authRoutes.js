const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/config');

const app = express();


app.post('/register', async (req, res) => {
  try {
    const userEmail = await User.findOne({email: req.body.email.toLocaleLowerCase()});
    const userUsername = await User.findOne({ username: req.body.username });

    if (userEmail) {
      return res.status(409).json({ success: false, message: 'This email already exist!' });
    }
    if (userUsername) {
      return res.status(409).json({ success: false, message: 'This username already exist!' });
    } else {
      var user = new User();
      user.username = req.body.username;
      user.email = req.body.email.toLocaleLowerCase();
      user.password = await bcrypt.hash(req.body.password, 10);
      const userNew = await user.save();
      // const token = await jwt.sign({ _id: userNew._id }, config.secret, {expiresIn: '1h'});
      // res.cookie('auth', token);

      return res.status(201).json({success: true, message: 'User created!', user: userNew});
    }
  } catch (err) {
    if (err.name == 'ValidationError') {
      var formatageMessage = err.message.split(', ');
      return res.status(400).json({ success: false, message: formatageMessage });
    }
    return res.status(400).json({ success: false, message: err });
  }
});


app.post('/login', async (req, res)=>{

  try{
      if(!req.body.username){
        res.status(404).json({success: false, message: '!req.body.username'});
      }else{
        const userOne = await User.findOne({username: req.body.username});
        if(!userOne){
            res.status(404).json({success: false, message: 'User dont exist!'});
        }else{
            if(!req.body.password){
                res.status(404).json({success: false, message: '!req.body.password'});
            }else{
                const comparePwd = await bcrypt.compare(req.body.password, userOne.password);
                if(comparePwd === true){
                    const token = await jwt.sign({user: {_id: userOne._id, email: userOne.email, username: userOne.username}}, config.secret, { expiresIn: '1h'});
                    res.cookie('auth', token);
                    // console.log('auth login token: ', res.cookie('auth', token))
                    res.status(200).json({success: true, message: 'Conexion succesfull!', token: token, user: userOne});
                }else{
                    res.status(404).json({success: false, message: 'Wrong password!'});
                }
            }
        }
      }
  }catch(err){
    console.log('err: ',err)
    res.status(404).json({success: false, err: err});
  }




});

module.exports = app;
