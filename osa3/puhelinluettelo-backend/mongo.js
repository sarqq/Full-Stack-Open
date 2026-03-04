const mongoose = require('mongoose')

// salasanaa ei annettu -> lopeta
if(process.argv.length <3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://sarqq_db:${password}@phonebook.3lku080.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url, {family:4})

// skeema
const personSchema = new mongoose.Schema(
    {
        name: String,
        number: String,
    }
)

// malli
const Person = mongoose.model('Person', personSchema)

// komento: node mongo.js <salasana> -> listaa kaikki oliot
if (process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
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
