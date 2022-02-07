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
    username: { type:  String , required : true },
    wpm: { type:  Number , required : true },
    rank: { type: Number, unique: true, required: true, dropDups: true }
})

userscoresSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Userscore', userscoresSchema)