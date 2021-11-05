const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const router = new express.Router()

router.get('/getAll',async (req,res)=>{
  await client.connect();
  const session = client.startSession();
  try{
    await session.withTransaction(async () => {
      const coll = client.db("almanac").collection("heroes");
      const resp = await coll.find({}, {
        sort: {name: 1},
        projection: {name: 1, title: 1, className: 1, attackType: 1},
        session
      }).toArray();
      res.status(200).send(resp);
    })
  } catch (err){
    res.status(500).send({error: err.message})
  } finally {
    await client.close();
  }
})

router.get('/get/:id',async (req,res)=>{
  await client.connect();
  const session = client.startSession();
  try{
    await session.withTransaction(async () => {
      const coll = client.db("almanac").collection("heroes");
      const resp = await coll.findOne({_id: new ObjectId(req.params.id)}, {session});
      console.log(resp);
      res.status(200).send(resp);
    })
  } catch (err){
    res.status(500).send({error: err.message})
  } finally {
    await client.close();
  }
})

router.post('/upload',async (req,res)=>{
  await client.connect();
  const session = client.startSession();
  try{
    await session.withTransaction(async () => {
      const coll = client.db("almanac").collection("heroes");
      await coll.insertOne(req.body, {session});
      res.status(200).send({status:'upload successful!'});
    })
  } catch (err){
    await session.abortTransaction();
    res.status(500).send({error: err.message})
  } finally {
    await session.endSession();
    await client.close();
  }
})

router.put('/edit/:id',async (req,res)=>{
  await client.connect();
  const session = client.startSession();
  try{
    await session.withTransaction(async () => {
      const coll = client.db("almanac").collection("heroes");
      await coll.replaceOne({_id: new ObjectId(req.params.id)}, req.body, {session});
      res.status(200).send({status:'edit successful!'});
    })
  } catch (err){
    await session.abortTransaction();
    res.status(500).send({error: err.message})
  } finally {
    await session.endSession();
    await client.close();
  }
})

module.exports = router;