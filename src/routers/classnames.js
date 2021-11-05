const express = require('express')
const mongoUtil = require('../db/conn');

const router = new express.Router()

router.get('/getAll',async (req,res)=>{
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("classnames").find({}, {
    projection: {_id: 0}
  }).toArray(function(err, result) {
    if(err){
      res.status(500).send({error: err.message})
    } else {
      res.status(200).send(result);
    }
  });
})

module.exports = router;