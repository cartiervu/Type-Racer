const mongoose = require('mongoose')

const url = process.env.MONGODB_URI_SCORES

console.log('connecting to', url)

var conn1 = mongoose.createConnection(url);

// Schema in Mongo DB
const scoreQuoteSchema = new mongoose.Schema({ 
    username: { type:  String , required : true },
    wpm: { type:  Number , required : true }},
    { collection : 'scoreQuote'})

scoreQuoteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Schema in Mongo DB
const timeSchema = new mongoose.Schema({ 
    username: { type:  String , required : true },
    wpm: { type:  Number , required : true }},
    { collection : 'scoreTime'})

timeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Schema in Mongo DB
const score30Schema = new mongoose.Schema({ 
    username: { type:  String , required : true },
    wpm: { type:  Number , required : true }},
    { collection : 'score30'})

    score30Schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const ScoreQuote = conn1.model('scoreQuote', scoreQuoteSchema);
const ScoreTime = conn1.model('scoreTime', timeSchema);
const Score30 = conn1.model('score30', score30Schema);


module.exports = {
    ScoreQuote, ScoreTime, Score30
}