const express = require("express");
const router = express.Router();
const db = require("../database/models");
const track = db.track;
const playlist = db.playlist;

/* HELPER FUNCTIONS */
const { isEmpty, isObjectPropertyEmpty, isNotNumber } = require("../helpers");

/* POST(CREATE) -  Add a new track */
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
    track
      .findOrCreate({
        where: { title: incomingData.title },
        defaults: {
          artist: incomingData.artist,
          playlist_id: incomingData.playlist_id,
        },
      })
      .then(([results, created]) =>
        created
          ? res.status(200).send(results.dataValues)
          : res.status(409).send({
              message: "A Track with this name already exists",
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

/* GET(READ) -  Retrieve all tracks */
router.get("/", (req, res) => {
  track
    .findAll()
    .then((results) => {
      const dataValues = results.map((element) => element.dataValues);
      dataValues.length > 0
        ? res.status(200).send(dataValues)
        : res
            .status(200)
            .send({ message: "There are no tracks saved at this moment!" });
    })
    .catch((findAllErr) => {
      if (createErr) {
        console.error(`Error when finding: ${findAllErr}`);

        res.status(500).send({
          message:
            "Sorry! We are currently having server difficulties. Try again later",
        });
      }
    });
});

/* GET(READ) ONE- Retrieve one track */
router.get("/:id", (req, res) => {
  if (isNotNumber(req.params.id)) {
    res.status(400).send({ message: "The given id was not a number!" });
  } else {
    track
      .findOne({ where: { id: req.params.id } })
      .then((results) =>
        results === null
          ? res.status(404).send({ message: "Couldn't find that book!" })
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

/* GET(READ) - Retrieve all books from one reading list */
router.get("/readList/:id", (req, res) => {
  if (isNotNumber(req.params.id)) {
    res.status(400).send({ message: "The given id was not a number!" });
  } else {
    book
      .findAll({ where: { playlist_id: req.params.id } })
      .then((results) => {
        const dataValues = results.map((element) => element.dataValues);
        dataValues.length > 0
          ? res.status(200).send(dataValues)
          : res.status(200).send({
              message:
                "There are no tracks connected to this playlist at this moment!",
            });
      })
      .catch((findAllErr) => {
        if (createErr) {
          console.error(`Error when finding: ${findAllErr}`);

          res.status(500).send({
            message:
              "Sorry! We are currently having server difficulties. Try again later",
          });
        }
      });
  }
});

/* PUT(UPDATE) - Modify one book */
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
      track
        .update({ title: incomingData.title }, { where: { id: req.params.id } })
        .then((results) =>
          results[0] === 1
            ? res
                .status(200)
                .send({ message: "The track title has been updated" })
            : res.status(404).send({ message: "Couldn't find that track" })
        )
        .catch((updateErr) => {
          if (updateErr) {
            console.error(`Error when updating title: ${updateErr}`);

            res.status(500).send({
              message:
                "Sorry! We are currently having server difficulties. Try again later",
            });
          }
        });

    // updating the artist, if artist exists in the incomingData
    incomingData.artist &&
      artist
        .update(
          { artist: incomingData.artist },
          { where: { id: req.params.id } }
        )
        .then((results) =>
          results[0] === 1
            ? res
                .status(200)
                .send({ message: "The book artist has been updated" })
            : res.status(404).send({ message: "Couldn't find that artist" })
        )
        .catch((updateErr) => {
          if (updateErr) {
            console.error(`Error when updating artist: ${updateErr}`);

            res.status(500).send({
              message:
                "Sorry! We are currently having server difficulties. Try again later",
            });
          }
        });

    // updating the playlist_id, if playlist_id exists in the incomingData
    incomingData.playlist_id &&
      playlist_id
        .findOne({ where: { id: incomingData.playlist_id } })
        .then((results) => {
          if (results === null) {
            res.status(404).send({ message: "the playlist_id does not exist" });
          } else {
            book
              .update(
                { playlist_id: incomingData.playlist_id },
                { where: { id: req.params.id } }
              )
              .then((results) => {
                results[0] === 1
                  ? res.status(200).send({
                      message: "The track playlist_id has been updated",
                    })
                  : res
                      .status(404)
                      .send({ message: "Couldn't find that track" });
              })
              .catch((updateErr) => {
                if (updateErr) {
                  console.error(`Error when updating: ${updateErr}`);

                  res.status(500).send({
                    message:
                      "Sorry! We are currently having server difficulties. Try again later",
                  });
                }
              });
          }
        })
        .catch((findErr) => {
          if (findErr) {
            console.error(`Error when updating: ${findErr}`);

            res.status(500).send({
              message:
                "Sorry! We are currently having server difficulties. Try again later",
            });
          }
        });
  }
});

/* DELETE(DELETE) - Deletes one track  */
router.delete("/:id", (req, res) => {
  if (isNotNumber(req.params.id)) {
    res.status(400).send({ message: "The given id was not a number!" });
  } else {
    track
      .destroy({ where: { id: req.params.id } })
      .then((results) =>
        results === 1
          ? res.status(200).send({ message: "The track has been deleted" })
          : res.status(404).send({ message: "Couldn't find that track" })
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
