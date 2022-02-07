const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('... successfully connected')
    })
    .catch((error) => {
        console.log ('... error connecting to MongoDB:', error.message)
    })

const userscoresSchema = new mongoose.Schema({
    name: String,
    score: Number
})

userscoresSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Userscore', userscoresSchema)