const express = require('express')
const { ObjectId } = require('mongodb');
const mongoUtil = require('../db/conn');

const router = express.Router()

router.get('/getAll',async (req,res)=>{
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").find({}, {
    sort: {name: 1},
    projection: {name: 1, title: 1, className: 1, attackType: 1}
  }).toArray(function(err, result) {
    if(err){
      res.status(500).send({error: err.message})
    } else {
      res.status(200).send(result);
    }
  });
})

router.get('/get/:id',async (req,res)=>{
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").findOne({
    _id: new ObjectId(req.params.id)
  }, function(err, result) {
    if(err){
      res.status(500).send({error: err.message})
    } else {
      res.status(200).send(result);
    }
  });
})

router.post('/upload',async (req,res)=>{
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").replaceOne(req.body, function(err) {
    if(err){
      res.status(500).send({error: err.message})
    } else {
      res.status(200).send({status:'upload successful!'});
    }
  });
})

router.put('/edit/:id',async (req,res)=>{
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").replaceOne({
    _id: new ObjectId(req.params.id)
  }, req.body, function(err) {
    if(err){
      res.status(500).send({error: err.message})
    } else {
      res.status(200).send({status:'edit successful!'});
    }
  });
})

router.delete('/delete/:id',async (req,res)=>{
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").deleteOne({
    _id: new ObjectId(req.params.id)
  }, function(err) {
    if(err){
      res.status(500).send({error: err.message})
    } else {
      res.status(200).send({status:'edit successful!'});
    }
  });
})

module.exports = router;