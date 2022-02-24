const mongoose = require('mongoose')

const url = process.env.MONGODB_URI_STRINGS

console.log('connecting to', url)

var conn2 = mongoose.createConnection(url);
    // .then(result => {
    //     console.log('... successfully connected')
    // })
    // .catch((error) => {
    //     console.log ('... error connecting to MongoDB:', error.message)
    // })

// Schema in Mongo DB
const stringsSchema = new mongoose.Schema(
    { Articles: { type:  String , required : true }},
    { collection : 'wikipedia-articles'})

stringsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})



module.exports = conn2.model('Strings', stringsSchema)