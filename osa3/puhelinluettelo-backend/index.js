const express = require('express')
const app = express()

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    },
]

// 3.1: koko puhelinluettelon palautus
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// 3.2: puhelinluettelon metatietojen palautus
app.get('/info', (request, response) => {
    const n = persons.length
    
    response.send(`<p>Current phonebook size: ${n} people.</p><p>Request made at: ${new Date().toUTCString()}</p>`)
})

// 3.3: yksittäisen puhelintiedon haku
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const entry = persons.find(person => person.id === id)

    // henkilö löytyi -> palautetaan henkilö
    if (entry) {
        response.json(entry)
    }
    //henkilö ei löytynyt -> 404
    else {
        response.status(404).json({
            message: `Person with id ${id} not found.`
        })
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})