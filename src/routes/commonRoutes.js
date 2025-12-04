const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/varifyAuth');
const Event=require("../models/Events")

router.get('/profile', userAuth, async (req, res) => {
    try{
        const user=req.user;
        res.status(200).send({user});
    }catch(err){
        res.status(500).send({message: err.message});
    }   
});


router.get('/event', async (req, res) => {
  try {
    const events = await Event.find().sort({
      date: 1,       
      startTime: 1   
    });

    res.status(200).send(events);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


module.exports = router;