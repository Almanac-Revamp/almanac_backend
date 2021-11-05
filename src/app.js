const express = require("express");
const cors = require("cors");

const heroesRouter = require("./routers/heroes");
const classRouter = require("./routers/classnames");

const app = express();

const port = process.env.PORT;

app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTION']
}))

app.use(express.json());
app.use("/heroes", heroesRouter);
app.use("/classnames", classRouter);

app.get("/health", (req, res) => {
  res.send({ status: "This service is healthy." });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});