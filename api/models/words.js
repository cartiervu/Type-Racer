const mongoose = require("mongoose");

const url = process.env.MONGODB_URI_WORDS;

console.log("connecting to", url);

var conn3 = mongoose.createConnection(url);

// Schema in Mongo DB
const wordsSchema = new mongoose.Schema(
  { Words: { type: String, required: true } },
  { collection: "words" }
);

wordsSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = conn3.model("Words", wordsSchema);
