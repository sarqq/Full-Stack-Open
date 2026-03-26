const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI, {family:4})
    .then((result) => {console.log("Connected to MongoDB")})
    .catch((error) => {console.log(`Error connecting to MongoDB: ${error.message}`)})

// skeema
const personSchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        minlength: 3,
        required: [true, "Name required"]
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: function(v) {
                return (/\d{2}-\d{6,}/.test(v)) | (/\d{3}-\d{5,}/.test(v));
            },
            message: props => `Invalid phone number: \'${props.value}\'`
        },
        required: [true, "Phone number required"]
    }
})

// formaatin muokkaus
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)