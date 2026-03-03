const express = require('express')
const morgan = require('morgan')
const app = express()

let phonebook = [
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

app.use(express.json())

//3.7: morgan
app.use(morgan('tiny'))

// 3.1: koko puhelinluettelon palautus
app.get('/api/persons', (request, response) => {
    response.status(200).json(phonebook)
})

// 3.2: puhelinluettelon metatietojen palautus
app.get('/info', (request, response) => {
    const n = phonebook.length
    
    response.status(200).send(`<p>Current phonebook size: ${n} people.</p><p>Request made at: ${new Date().toUTCString()}</p>`)
})

// 3.3: yksittäisen puhelintiedon haku
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const entry = phonebook.find(person => person.id === id)

    // henkilö löytyi -> palautetaan henkilö
    if (entry) {
        response.status(200).json(entry)
    }
    //henkilö ei löytynyt -> 404
    else {
        response.status(404).json({
            error: `Person with id ${id} not found.`
        })
    }
})

// 3.4: yksittäisen puhelintiedon poisto
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const target = phonebook.find(person => person.id === id)
    
    // henkilö löytyi, poisto -> 204
    if (target) {
        phonebook = phonebook.filter(person => person.id !== id)

        response.status(204).end()
    }
    // henkilöä ei löytynyt -> 404
    else {
        response.status(404).json({
            error: `Person with id ${id} not found.`
        })
    }
})

// 3.5: uuden puhelintiedon lisäys
app.post('/api/persons', (request, response) => {
    const entry = request.body

    // 3.6: ei parametreja
    if(!entry || !entry.name || !entry.number) {
        response.status(400).json({error: "Invalid arguments."})
    }

    // 3.6: henkilö löytyy jo puhelinluettelosta -> 200, ei lisäystä
    phonebook.forEach(person => {
        if (person.name === entry.name) {
            response.status(200).json({error: "Name must be unique."})
        }
    })

    // parametrit ok, ei valmiiksi luettelossa oleva henkilö -> luo uusi puhelintieto
    const max_id = phonebook.length > 0
        ? Math.max(...phonebook.map(n => Number(n.id)))
        : 0
    entry.id = String(max_id+1)    

    phonebook = phonebook.concat(entry)
    response.status(201).json({entry})
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})