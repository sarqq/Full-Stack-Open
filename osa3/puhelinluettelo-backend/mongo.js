const mongoose = require('mongoose')

// salasanaa ei annettu -> lopeta
if(process.argv.length <3) {
    console.log("Give password as argument.")
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://sarqq_db:${password}@phonebook.3lku080.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url, {family:4})
    .then(result => {console.log("Connected to MongoDB")})
    .catch((error) => {console.log(`Error connecting to MongoDB: ${error.message}`)})


// skeema
const personSchema = new mongoose.Schema(
    {
        name: String,
        number: String,
    }
)
// formaatin muokkaus
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// malli
const Person = mongoose.model("Person", personSchema)


// komento: node mongo.js <salasana> -> listaa kaikki oliot
if (process.argv.length === 3){
    Person.find({}).then(result => {
        console.log("Phonebook: ")
        result.forEach(person => {
            console.log(person.name, person.number)
        })

        mongoose.connection.close()
    })
}
// komento: node mongo.js <salasana> <nimi> <puhelinnumero> -> lisää uusi olio
else if(process.argv.length === 5) {
    const name = process.argv[3].toString()
    const number = process.argv[4].toString()

    const person = new Person({name, number})

    person.save().then(() => {
        console.log(`New entry: ${name}`)
        mongoose.connection.close()
    })
}
