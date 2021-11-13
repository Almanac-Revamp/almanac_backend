const express = require("express");
const cors = require("cors");
const mongoUtil = require('./db/conn');

const heroesRouter = require("./routers/heroes");
const classRouter = require("./routers/classnames");

const app = express();

const port = process.env.PORT;

mongoUtil.connectToServer(function(err, client) {
  if(err) {
    console.log(err);
  } else {
    app.use(cors({
      origin: process.env.ORIGIN,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTION']
    }))
    
    app.use(express.json({limit: '5mb'}));
    app.use(express.urlencoded({limit: '5mb', extended: true}));
    app.use("/heroes", heroesRouter);
    app.use("/classnames", classRouter);
    app.use("/images", express.static('public'));
    
    app.get("/health", (req, res) => {
      res.send({ status: "This service is healthy." });
    });
    
    app.listen(port, () => {
      console.log("Server is up on port " + port);
    });
  }
})