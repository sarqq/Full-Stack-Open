const mongoose = require('mongoose')

// skeema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// formaatin muokkaus
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)