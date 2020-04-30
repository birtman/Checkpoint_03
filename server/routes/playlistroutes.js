/* DEPENDENCIES */
const express = require("express");
const router = express.Router();
const db = require("../database/models");
const playlist = db.playlist;

/* HELPER FUNCTIONS */
const { isEmpty, isObjectPropertyEmpty, isNotNumber } = require("../helpers");

/* POST(CREATE) - Add a new playlist */
router.post("/", (req, res) => {
  const incomingData = req.body;

  /* validate incoming data  */
  // check if object is empty
  isEmpty(incomingData) &&
    res.status(400).send({ message: "Input fields cannot be empty" });

  // if any of the properties are null or empty
  if (isObjectPropertyEmpty(incomingData)) {
    res.status(400).send({ message: "Please fill in all the fields" });
  } else {
    playlist
      .findOrCreate({
        where: { title: incomingData.title },
        defaults: { type: incomingData.type },
      })
      .then(([results, created]) =>
        created
          ? res.status(200).send(results.dataValues)
          : res.status(409).send({
              message: "A playlist with this name already exists",
            })
      )
      .catch((createErr) => {
        if (createErr) {
          console.error(`Error when creating: ${createErr}`);

          res.status(500).send({
            message:
              "Sorry! We are currently having server difficulties. Try again later",
          });
        }
      });
  }
});

/* GET(READ) - Retrieve all playlists */
router.get("/", (req, res) => {
  playlist
    .findAll()
    .then((results) => {
      const dataValues = results.map((element) => element.dataValues);
      dataValues.length > 0
        ? res.status(200).send(dataValues)
        : res
            .status(200)
            .send({ message: "playlist is empty at this moment!" });
    })
    .catch((findAllErr) => {
      if (findAllErr) {
        console.error(`Error when finding: ${findAllErr}`);

        res.status(500).send({
          message:
            "Sorry! We are currently having server difficulties. Try again later",
        });
      }
    });
});

/* GET(READ) ONE - Retrieve one playlist  */
router.get("/:id", (req, res) => {
  if (isNotNumber(req.params.id)) {
    res.status(400).send({ message: "The given id was not a number!" });
  } else {
    playlist
      .findOne({ where: { id: req.params.id } })
      .then((results) =>
        results === null
          ? res.status(404).send({ message: "Couldn't find that playlist!" })
          : res.status(200).send(results.dataValues)
      )
      .catch((findOneErr) => {
        if (findOneErr) {
          console.error(`Error when finding one: ${findOneErr}`);

          res.status(500).send({
            message:
              "Sorry! We are currently having server difficulties. Try again later",
          });
        }
      });
  }
});

/* PUT(UPDATE) - Modify one playlist  */
router.put("/:id", (req, res) => {
  const incomingData = req.body;

  isEmpty(incomingData) &&
    res.status(400).send({ message: "Input fields cannot be empty" });

  if (isObjectPropertyEmpty(incomingData)) {
    res.status(400).send({ message: "Please fill in all the fields" });
  } else if (isNotNumber(req.params.id)) {
    res.status(400).send({ message: "The given id was not a number!" });
  } else {
    // updating the title if title exists in the incomingData
    incomingData.title &&
      readingList
        .update({ title: incomingData.title }, { where: { id: req.params.id } })
        .then((results) =>
          results[0] === 1
            ? res
                .status(200)
                .send({ message: "The playlist name has been updated" })
            : res.status(404).send({ message: "Couldn't find that playlist" })
        )
        .catch((updateErr) => {
          if (updateErr) {
            console.error(`Error when updating: ${updateErr}`);

            res.status(500).send({
              message:
                "Sorry! We are currently having server difficulties. Try again later",
            });
          }
        });

    // updating the type, if type exists in the incomingData
    incomingData.genre &&
      playlist
        .update({ genre: incomingData.genre }, { where: { id: req.params.id } })
        .then((results) =>
          results[0] === 1
            ? res
                .status(200)
                .send({ message: "The playlist genre has been updated" })
            : res.status(404).send({ message: "Couldn't find that playlist" })
        )
        .catch((updateErr) => {
          if (updateErr) {
            console.error(`Error when updating type: ${updateErr}`);

            res.status(500).send({
              message:
                "Sorry! We are currently having server difficulties. Try again later",
            });
          }
        });
  }
});

/* DELETE(DELETE) - Deletes one reading list  */
router.delete("/:id", (req, res) => {
  if (isNotNumber(req.params.id)) {
    res.status(400).send({ message: "The given id was not a number!" });
  } else {
    playlist
      .destroy({ where: { id: req.params.id } })
      .then((results) =>
        results === 1
          ? res
              .status(200)
              .send({ message: "The playlist name has been deleted" })
          : res.status(404).send({ message: "Couldn't find that playlist" })
      )
      .catch((destroyErr) => {
        if (destroyErr) {
          console.error(`Error when deleting: ${destroyErr}`);

          res.status(500).send({
            message:
              "Sorry! We are currently having server difficulties. Try again later",
          });
        }
      });
  }
});

module.exports = router;
