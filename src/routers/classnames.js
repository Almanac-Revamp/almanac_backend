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
      const coll = client.db("almanac").collection("classnames");
      const resp = await coll.find({}, {
        projection: {_id: 0},
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

module.exports = router;