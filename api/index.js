require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Userscores = require('./models/userscores.js')

const app = express()

app.use(express.json())                // Middleware: read JSON content requests
app.use(express.static('build'))    // Middleware: Show the React frontend - Check if the build directory contains a file corresponding to the request's address
app.use(cors())                     // Middleware: Communicate between 3000 and 3001

// Middleware: Log http requests
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
    response.send('<h1>Hello World! </h1>')
})

// Get all userscores in MongoDB as JSON
app.get('/api/userscores', (request, response) => {
    Userscores.find({}).sort('rank')
        .then(userscore => {
            response.json(userscore)
        })
})

// Get specific userscore
app.get('/api/userscores/:id', (request, response) => {
    Userscores.findById(request.params.id)
        .then(userscore => {
            if (userscore) {
                response.json(userscore)
            } else {
                response.status(404).end() // No associated id
            }
        })
        .catch (error => {
            response.status(400).send({ error: 'malformatted id '}) // Invalid id
        })
})

// Delete a specific userscore
app.delete('/api/userscores/:id', (request, response) => {
    Userscores.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end() // Success, no content
        })
        .catch(error => 
            response.status(400).json({error: 'could not delete'})
        )
})

// Post a new score
app.post('/api/userscores', (request, response) => {
    const body = request.body
    
    // Content missing from post request
    if(!body.username || !body.wpm) {
        return (response.status(400).json({error: 'content missing'}))
    }

    const newScore = new Userscores({
        username: body.username,
        wpm: body.wpm,
        rank: body.rank
    })

    newScore.save()
        .then(savedScore => {
            response.json(savedScore)
        })
        .catch(error => {
            response.status(400).json({error: 'could not post'})
        })

})

// Update a score
app.put('/api/userscores/:id', (request, response) => {
    const {id: _id} = request.params;
    const body = request.body;

    // Score missing from put request
    if(!body.username || !body.wpm) {
        return (response.status(400).json({error: 'content missing'}))
    }

    const score = new Userscores({
        _id,
        username: body.username,
        wpm: body.wpm,
        rank: body.rank
    })

    Userscores.findByIdAndUpdate(_id, score)
        .then(updatedScore => {
            response.json(score)
        })
        .catch(error => {
            response.status(400).json({error: 'could not update'})
        })
})

// Invalid address
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown address'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})