const mongoose = require('mongoose')

const url = process.env.MONGODB_URI_SCORES

console.log('connecting to', url)

var conn1 = mongoose.createConnection(url);

// Schema in Mongo DB
const wpmSchema = new mongoose.Schema({ 
    username: { type:  String , required : true },
    wpm: { type:  Number , required : true }},
    { collection : 'wpm'})

wpmSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Schema in Mongo DB
const score15Schema = new mongoose.Schema({ 
    username: { type:  String , required : true },
    seconds: { type:  Number , required : true }},
    { collection : 'score15'})

score15Schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const WPM = conn1.model('wpm', wpmSchema);
const Score15 = conn1.model('score15', score15Schema);

module.exports = {
    WPM, Score15
}