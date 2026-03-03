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

app.use(express.static('dist'))
app.use(express.json())

// 3.8: token näyttämään luotu olio POST-pyyntöjen lokimerkinnöissä
morgan.token('created-object', (request, response) => { 
    return response.locals.createdObject ? JSON.stringify(response.locals.createdObject) : "";
});

morgan.token('pid', () => process.pid);

// 3.7 & 3.8: morgan
app.use(morgan('tiny', {skip: (request) => request.method === 'POST'}));

app.use(morgan(':method :url :status :pid - :response-time ms :created-object', {
    skip: (request) => request.method !== 'POST'
    })
);

// 3.1: koko puhelinluettelon palautus
app.get('/api/persons', (request, response) => {
    return response.status(200).json(phonebook)
})

// 3.2: puhelinluettelon metatietojen palautus
app.get('/info', (request, response) => {
    const n = phonebook.length
    
    return response.status(200).send(`<p>Current phonebook size: ${n} people.</p><p>Request made at: ${new Date().toUTCString()}</p>`)
})

// 3.3: yksittäisen puhelintiedon haku
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const entry = phonebook.find(person => person.id === id)

    // henkilö löytyi -> palautetaan henkilö
    if (entry) {
        return response.status(200).json(entry)
    }
    //henkilö ei löytynyt -> 404
    else {
        return response.status(404).json({error: `Person with id ${id} not found.`})
    }
})

// 3.4: yksittäisen puhelintiedon poisto
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const target = phonebook.find(person => person.id === id)
    
    // henkilö löytyi, poisto -> 204
    if (target) {
        phonebook = phonebook.filter(person => person.id !== id)

        return response.status(204).end()
    }
    // henkilöä ei löytynyt -> 404
    else {
        return response.status(404).json({error: `Person with id ${id} not found.`})
    }
})

// 3.5: uuden puhelintiedon lisäys
app.post('/api/persons', (request, response) => {
    const entry = request.body

    // 3.6: ei parametreja -> 400
    if(!entry || !entry.name || !entry.number) {
        return response.status(400).json({error: "Invalid arguments."})
    }

    // 3.6: henkilö löytyy jo puhelinluettelosta -> 400, ei lisäystä
    if (phonebook.some(person => person.name === entry.name)) {
        return response.status(400).json({error: "Name must be unique."})
    }

    // parametrit ok, ei valmiiksi luettelossa oleva henkilö -> luo uusi puhelintieto
    const max_id = phonebook.length > 0
        ? Math.max(...phonebook.map(n => Number(n.id)))
        : 0
    entry.id = String(max_id+1)    

    phonebook = phonebook.concat(entry)
    response.locals.createdObject = entry
    
    return response.status(201).json(entry)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})