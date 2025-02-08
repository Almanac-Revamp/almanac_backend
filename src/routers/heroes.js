const express = require("express");
const { ObjectId } = require("mongodb");
const mongoUtil = require("../db/conn");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");

const multer = require("multer");
const { isArray } = require("lodash");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/thumbnails");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/getAll", async (req, res) => {
  const dbConnect = mongoUtil.getDb();
  dbConnect
    .collection("heroes")
    .find(
      {},
      {
        sort: { name: 1 },
        projection: {
          name: 1,
          title: 1,
          className: 1,
          attackType: 1,
          thumbName: 1,
        },
      }
    )
    .toArray(function (err, result) {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send(result);
      }
    });
});

router.get("/getFiltered", async (req, res) => {
  const searchWord = req.query.searchWord ?? "";
  const chosenClass = req.query.chosenClass ?? "";
  const range = req.query.range ?? "";

  const dbConnect = mongoUtil.getDb();
  dbConnect
    .collection("heroes")
    .find(
      {
        $and: [
          {
            $or: [
              { name: { $regex: searchWord, $options: "i" } },
              { title: { $regex: searchWord, $options: "i" } },
            ],
          },
          {
            $or: isArray(chosenClass)
              ? _.map(chosenClass, (item) => ({ className: { $regex: item } }))
              : [{ className: { $regex: chosenClass } }],
          },
        ],
        attackType: { $regex: range },
      },
      {
        sort: { name: 1 },
        projection: {
          name: 1,
          title: 1,
          className: 1,
          attackType: 1,
          thumbName: 1,
        },
      }
    )
    .toArray(function (err, result) {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send(result);
      }
    });
});

router.get("/get/:id", async (req, res) => {
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").findOne(
    {
      _id: new ObjectId(req.params.id),
    },
    function (err, result) {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send(result);
      }
    }
  );
});

router.post("/upload", upload.single("thumbnail"), async (req, res) => {
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").insertOne(JSON.parse(req.body.hero), function (err) {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({ status: "upload successful!" });
    }
  });
});

router.put("/edit/:id", upload.single("thumbnail"), async (req, res) => {
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").replaceOne(
    {
      _id: new ObjectId(req.params.id),
    },
    JSON.parse(req.body.hero),
    function (err) {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        if (
          req.body.oldImageName && req.file
            ? req.body.oldImageName !== req.file.originalname
            : false
        ) {
          fs.unlink(
            path.resolve(`./public/thumbnails/${req.body.oldImageName}`),
            (err) => {
              if (err) res.status(500).send({ error: err.message });
            }
          );
        }
        res.status(200).send({ status: "edit successful!" });
      }
    }
  );
});

router.delete("/delete/:id", async (req, res) => {
  const dbConnect = mongoUtil.getDb();
  dbConnect.collection("heroes").deleteOne(
    {
      _id: new ObjectId(req.params.id),
    },
    function (err) {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send({ status: "edit successful!" });
      }
    }
  );
});

module.exports = router;
