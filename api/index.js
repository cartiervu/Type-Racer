require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {WPM, Score15} = require('./models/userscores.js')
const Strings = require('./models/strings.js')
const Words = require('./models/words.js')

const app = express()

app.use(express.json())             // Middleware: read JSON content requests
app.use(express.static('build'))    // Middleware: Show the React frontend - Check if the build directory contains a file corresponding to the request's address
app.use(cors())                     // Middleware: Communicate between 3000 and 3001

// Middleware: Log http requests
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
    response.send('<h1>Hello World! </h1>')
})

// Get all wpm userscores in MongoDB as JSON
app.get('/api/userscores/wpm', (request, response) => {
    WPM
    .find({}).sort({ wpm : 'descending'})
            .then(userscore => {
                response.json(userscore)
            })
})

// Get all wpm userscores in MongoDB as JSON
app.get('/api/userscores/score15', (request, response) => {
    Score15
    .find({}).sort({ seconds : 'ascending'})
            .then(userscore => {
                response.json(userscore)
            })
})

// // Get specific wpm userscore
// app.get('/api/userscores/wpm/:id', (request, response) => {
//     WPM
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
app.get('/api/strings', (request, response) => {
    Strings.aggregate([{ $sample: { size: 1 } }])
    // Strings.find({})
        .then(quote => {
            console.log(quote)
            response.json(quote)
        })
})

// Get random words
app.get('/api/words/:num_words', (request, response) => {

    let wordArray = new Array();

    Words.aggregate([{ $sample: { size: Number(request.params.num_words) } }])
        .then(result => {
            // response.json(result)
            result.map(word => wordArray.push(word.Words))
            console.log(wordArray);
            response.json(wordArray)
        })
})

// // Delete a specific userscore from the wpm datgabase
// app.delete('/api/userscores/wpm/:id', (request, response) => {
//     WPM
//     .findByIdAndDelete(request.params.id)
//             .then(result => {
//                 response.status(204).end() // Success, no content
//             })
//             .catch(error => 
//                 response.status(400).json({error: 'could not delete'})
//             )
// })

// Prune the wpm database - keep only the top ten scores
app.delete('/api/userscores/wpm', (request, response) => {

    WPM
    .countDocuments({})
            .then(result => {
                // More than 10 results
                if (result > 10) {

                    let idsToDelete = new Array();

                    // Get these bottom results
                    WPM
                    .find({}).sort({ wpm : 'ascending'}).limit(result - 10)
                        .then(result => {
                                // Put into an array
                                result.map(user =>{
                                    idsToDelete.push(user._id.toString());
                                })

                            // Delete ids
                            WPM
                            .deleteMany({_id: { $in: idsToDelete}})
                                    .then(result => {
                                        response.status(204).end() // Success, no content
                                    })
                                    .catch(error => 
                                        response.status(400).json({error: 'could not prune database'})
                                    )
                        }
                    )
                    .catch(err => {
                        response.status(400).json({error: 'could not prune database'})
                    })

                } else {
                    response.status(204).end() // Success, no content
                }
            })
            .catch(error => {
                response.status(400).json({error: 'could not prune database'})
            })
    
})

// Prune the score15 database - keep only the top ten scores
app.delete('/api/userscores/score15', (request, response) => {

    Score15
    .countDocuments({})
            .then(result => {
                // More than 10 results
                if (result > 10) {

                    let idsToDelete = new Array();

                    // Get these bottom results
                    Score15
                    .find({}).sort({ seconds : 'descending'}).limit(result - 10)
                        .then(result => {
                                // Put into an array
                                result.map(user =>{
                                    idsToDelete.push(user._id.toString());
                                })

                            // Delete ids
                            Score15
                            .deleteMany({_id: { $in: idsToDelete}})
                                    .then(result => {
                                        response.status(204).end() // Success, no content
                                    })
                                    .catch(error => 
                                        response.status(400).json({error: 'could not prune database'})
                                    )
                        }
                    )
                    .catch(err => {
                        response.status(400).json({error: 'could not prune database'})
                    })

                } else {
                    response.status(204).end() // Success, no content
                }
            })
            .catch(error => {
                response.status(400).json({error: 'could not prune database'})
            })
    
})

// Remove all scores from the wpm database
app.delete('/api/userscores/wpm/deleteall', (request, response) => {

    WPM
    .collection.deleteMany({})
            .then(result => {
                response.status(204).end() // Success, no content
            })
            .catch(error => {
                response.status(400).json({error: 'could not clean-up database'})
            })
    
})

// Remove all scores from the score15 database
app.delete('/api/userscores/score15/deleteall', (request, response) => {

    Score15
    .collection.deleteMany({})
            .then(result => {
                response.status(204).end() // Success, no content
            })
            .catch(error => {
                response.status(400).json({error: 'could not clean-up database'})
            })
    
})

// Post a new score to the wpm database
app.post('/api/userscores/wpm', (request, response) => {
    const body = request.body
    
    // Content missing from post request
    if(!body.username || !body.wpm) {
        return (response.status(400).json({error: 'content missing'}))
    }

    const newScore = new WPM({
            username: body.username,
            wpm: body.wpm
        })

    newScore.save()
        .then(savedScore => {
            response.json(savedScore)
        })
        .catch(error => {
            response.status(400).json({error: 'could not post'})
        })

})

// Post a new score to the score15 database
app.post('/api/userscores/score15', (request, response) => {
    const body = request.body
    
    // Content missing from post request
    if(!body.username || !body.seconds) {
        return (response.status(400).json({error: 'content missing'}))
    }

    const newScore = new Score15({
            username: body.username,
            seconds: body.seconds
        })

    newScore.save()
        .then(savedScore => {
            response.json(savedScore)
        })
        .catch(error => {
            response.status(400).json({error: 'could not post'})
        })

})

// // Update a specific wpm score 
// app.put('/api/userscores/wpm/:id', (request, response) => {
//     const {id: _id} = request.params;
//     const body = request.body;

//     // Score missing from put request
//     if(!body.username || !body.wpm) {
//         return (response.status(400).json({error: 'content missing'}))
//     }

//     const score = new WPM
// ({
//         _id,
//         username: body.username,
//         wpm: body.wpm
//     })

//     WPM
//     .findByIdAndUpdate(_id, score)
//             .then(updatedScore => {
//                 response.json(score)
//             })
//             .catch(error => {
//                 response.status(400).json({error: 'could not update'})
//             })
// })

// Invalid address
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown address'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})