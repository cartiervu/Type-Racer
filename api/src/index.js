require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const morgan = require("morgan");
const cors = require("cors");

const { ScoreQuote, ScoreTime, Score30 } = require("../models/userscores.js");
const Strings = require("../models/strings.js");
const Words = require("../models/words.js");

const path = require("path");
const app = express();

app.use(express.json()); // Middleware: read JSON content requests
app.use(express.static("build")); // Middleware: Show the React frontend - Check if the build directory contains a file corresponding to the request's address
app.use(cors()); // Middleware: Communicate between 3000 and 3001

// Middleware: Log http requests
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Create a router to handle routes
const router = express.Router();

router.get("/", (request, response) => {
  response.send("<h1>Hello World! </h1>");
});

// Get all quote userscores in MongoDB as JSON
router.get("/api/userscores/quote", (request, response) => {
  ScoreQuote.find({})
    .sort({ wpm: "descending" })
    .then((userscore) => {
      response.json(userscore);
    });
});

// Get all time userscores in MongoDB as JSON
router.get("/api/userscores/time", (request, response) => {
  ScoreTime.find({})
    .sort({ wpm: "descending" })
    .then((userscore) => {
      response.json(userscore);
    });
});

// Get all 30 word userscores in MongoDB as JSON
router.get("/api/userscores/score30", (request, response) => {
  Score30.find({})
    .sort({ wpm: "descending" })
    .then((userscore) => {
      response.json(userscore);
    });
});

// // Get specific quote userscore
// app.get('/api/userscores/quote/:id', (request, response) => {
//     ScoreQuote
//     .findById(request.params.id)
//             .then(userscore => {
//                 if (userscore) {
//                     response.json(userscore)
//                 } else {
//                     response.status(404).end() // No associated id
//                 }
//             })
//             .catch (error => {
//                 response.status(400).send({ error: 'malformatted id '}) // Invalid id
//             })all_userscores
// })

// Get a random quote
router.get("/api/strings", (request, response) => {
  Strings.aggregate([{ $sample: { size: 1 } }])
    // Strings.find({})
    .then((quote) => {
      console.log(quote);
      response.json(quote);
    });
});

// Get random words
router.get("/api/words/:num_words", (request, response) => {
  let wordArray = new Array();

  Words.aggregate([
    { $sample: { size: Number(request.params.num_words) } },
  ]).then((result) => {
    // response.json(result)
    result.map((word) => wordArray.push(word.Words));
    console.log(wordArray);
    response.json(wordArray);
  });
});

// // Delete a specific userscore from the quote datgabase
// app.delete('/api/userscores/quote/:id', (request, response) => {
//     ScoreQuote
//     .findByIdAndDelete(request.params.id)
//             .then(result => {
//                 response.status(204).end() // Success, no content
//             })
//             .catch(error =>
//                 response.status(400).json({error: 'could not delete'})
//             )
// })

// Prune the quote score database - keep only the top ten scores
router.delete("/api/userscores/quote", (request, response) => {
  ScoreQuote.countDocuments({})
    .then((result) => {
      // More than 10 results
      if (result > 10) {
        let idsToDelete = new Array();

        // Get these bottom results
        ScoreQuote.find({})
          .sort({ wpm: "ascending" })
          .limit(result - 10)
          .then((result) => {
            // Put into an array
            result.map((user) => {
              idsToDelete.push(user._id.toString());
            });

            // Delete ids
            ScoreQuote.deleteMany({ _id: { $in: idsToDelete } })
              .then((result) => {
                response.status(204).end(); // Success, no content
              })
              .catch((error) =>
                response.status(400).json({ error: "could not prune database" })
              );
          })
          .catch((err) => {
            response.status(400).json({ error: "could not prune database" });
          });
      } else {
        response.status(204).end(); // Success, no content
      }
    })
    .catch((error) => {
      response.status(400).json({ error: "could not prune database" });
    });
});

// Prune the time database - keep only the top ten scores
router.delete("/api/userscores/time", (request, response) => {
  ScoreTime.countDocuments({})
    .then((result) => {
      // More than 10 results
      if (result > 10) {
        let idsToDelete = new Array();

        // Get these bottom results
        ScoreTime.find({})
          .sort({ wpm: "ascending" })
          .limit(result - 10)
          .then((result) => {
            // Put into an array
            result.map((user) => {
              idsToDelete.push(user._id.toString());
            });

            // Delete ids
            ScoreTime.deleteMany({ _id: { $in: idsToDelete } })
              .then((result) => {
                response.status(204).end(); // Success, no content
              })
              .catch((error) =>
                response.status(400).json({ error: "could not prune database" })
              );
          })
          .catch((err) => {
            response.status(400).json({ error: "could not prune database" });
          });
      } else {
        response.status(204).end(); // Success, no content
      }
    })
    .catch((error) => {
      response.status(400).json({ error: "could not prune database" });
    });
});

// Prune the score30 database - keep only the top ten scores
router.delete("/api/userscores/score30", (request, response) => {
  Score30.countDocuments({})
    .then((result) => {
      // More than 10 results
      if (result > 10) {
        let idsToDelete = new Array();

        // Get these bottom results
        Score30.find({})
          .sort({ wpm: "ascending" })
          .limit(result - 10)
          .then((result) => {
            // Put into an array
            result.map((user) => {
              idsToDelete.push(user._id.toString());
            });

            // Delete ids
            Score30.deleteMany({ _id: { $in: idsToDelete } })
              .then((result) => {
                response.status(204).end(); // Success, no content
              })
              .catch((error) =>
                response.status(400).json({ error: "could not prune database" })
              );
          })
          .catch((err) => {
            response.status(400).json({ error: "could not prune database" });
          });
      } else {
        response.status(204).end(); // Success, no content
      }
    })
    .catch((error) => {
      response.status(400).json({ error: "could not prune database" });
    });
});

// Remove all scores from the quote database
router.delete("/api/userscores/quote/deleteall", (request, response) => {
  ScoreQuote.collection
    .deleteMany({})
    .then((result) => {
      response.status(204).end(); // Success, no content
    })
    .catch((error) => {
      response.status(400).json({ error: "could not clean-up database" });
    });
});

// Remove all scores from the time database
router.delete("/api/userscores/time/deleteall", (request, response) => {
  ScoreTime.collection
    .deleteMany({})
    .then((result) => {
      response.status(204).end(); // Success, no content
    })
    .catch((error) => {
      response.status(400).json({ error: "could not clean-up database" });
    });
});

// Remove all scores from the score30 database
router.delete("/api/userscores/score30/deleteall", (request, response) => {
  Score30.collection
    .deleteMany({})
    .then((result) => {
      response.status(204).end(); // Success, no content
    })
    .catch((error) => {
      response.status(400).json({ error: "could not clean-up database" });
    });
});

// Post a new score to the quote database
router.post("/api/userscores/quote", (request, response) => {
  const body = request.body;

  // Content missing from post request
  if (!body.username || !body.wpm) {
    return response.status(400).json({ error: "content missing" });
  }

  const newScore = new ScoreQuote({
    username: body.username,
    wpm: body.wpm,
  });

  newScore
    .save()
    .then((savedScore) => {
      response.json(savedScore);
    })
    .catch((error) => {
      response.status(400).json({ error: "could not post" });
    });
});

// Post a new score to the time database
router.post("/api/userscores/time", (request, response) => {
  const body = request.body;

  // Content missing from post request
  if (!body.username || !body.wpm) {
    return response.status(400).json({ error: "content missing" });
  }

  const newScore = new ScoreTime({
    username: body.username,
    wpm: body.wpm,
  });

  newScore
    .save()
    .then((savedScore) => {
      response.json(savedScore);
    })
    .catch((error) => {
      response.status(400).json({ error: "could not post" });
    });
});

// Post a new score to the score30 database
router.post("/api/userscores/score30", (request, response) => {
  const body = request.body;

  // Content missing from post request
  if (!body.username || !body.wpm) {
    return response.status(400).json({ error: "content missing" });
  }

  const newScore = new Score30({
    username: body.username,
    wpm: body.wpm,
  });

  newScore
    .save()
    .then((savedScore) => {
      response.json(savedScore);
    })
    .catch((error) => {
      response.status(400).json({ error: "could not post" });
    });
});

// // Update a specific quote score
// app.put('/api/userscores/quote/:id', (request, response) => {
//     const {id: _id} = request.params;
//     const body = request.body;

//     // Score missing from put request
//     if(!body.username || !body.wpm) {
//         return (response.status(400).json({error: 'content missing'}))
//     }

//     const score = new ScoreQuote ({
//         _id,
//         username: body.username,
//         wpm: body.wpm
//     })

//     ScoreQuote
//     .findByIdAndUpdate(_id, score)
//             .then(updatedScore => {
//                 response.json(score)
//             })
//             .catch(error => {
//                 response.status(400).json({error: 'could not update'})
//             })
// })

// // Invalid address
// const unknownEndpoint = (request, response) => {
//     response.status(404).send({error: 'unknown address'})
// }

// app.use(unknownEndpoint)

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })

app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
