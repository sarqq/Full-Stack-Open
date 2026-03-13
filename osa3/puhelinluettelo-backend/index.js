require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

// expressJS
const app = express()

app.use(express.static('dist'))
app.use(express.json())

// 3.8: token näyttämään luotu olio POST-pyyntöjen lokimerkinnöissä
morgan.token('created-object', (request, response) => { 
    return response.locals.createdObject ? JSON.stringify(response.locals.createdObject) : "";
});
morgan.token('pid', () => process.pid);

// 3.7 & 3.8: morgan-kirjausten formatointi
app.use(morgan('tiny', {skip: (request) => request.method === 'POST'}));
app.use(morgan(':method :url :status :pid - :response-time ms :created-object', {
    skip: (request) => request.method !== 'POST'
    })
);

// 3.1 & 3.13: koko puhelinluettelon palautus
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.status(200).json(persons)
    })
    .catch(error => response.status(500).json({error: error.message}))
})

// 3.2: puhelinluettelon metatietojen palautus
app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        response.status(200).send(
            `<p>Current phonebook size: ${count} people.</p>
            <p>Request made at: ${new Date().toUTCString()}</p>`
        )
    })
    .catch(error => response.status(500).json({error: error.message}))
})

// 3.3: yksittäisen puhelintiedon haku
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id).then((found) => {        
        return (found)
            // henkilö löytyi -> 200, palautetaan henkilö
            ? response.status(200).json(found)
            // ei löytynyt -> 404
            : response.status(404).json({error: `Person with id ${id}  not found.`})
    })
    .catch(() => response.status(400).json({error: "Malformed id."}))    
})

// 3.4: yksittäisen puhelintiedon poisto
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(success => {
        return (success)
            // henkilö löytyi, poisto -> 204
            ? response.status(204).end()
            // ei löytynyt -> 404
            : response.status(404).json({error: `Person with id ${request.params.id} not found.`})
    })
    .catch(() => response.status(400).json({error: "Malformed id."}))
})

// 3.5: uuden puhelintiedon lisäys
app.post('/api/persons', (request, response) => {
    const body = request.body

    // 3.6: ei parametreja -> 400
    if(!body || !body.name || !body.number) {
        return response.status(400).json({error: "Invalid arguments."})
    }

    // 3.6: henkilö löytyy jo puhelinluettelosta -> 400, ei lisäystä
    Person.findOne({name: body.name}).then(target => {
        if (target) {
            return response.status(400).json({error: "Name must be unique."})
        }

        // parametrit ok, ei valmiiksi luettelossa oleva henkilö -> luo uusi puhelintieto

        const newEntry = new Person({
            name: body.name,
            number: body.number,
        })

        newEntry.save().then(savedEntry => {
            response.locals.createdObject = savedEntry
            response.status(201).json(savedEntry)
        })
    })
    .catch(error => response.status(500).json({error: error.message}))
})

// catch-all tuntemattomille kutsuille
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "Unknown endpoint."})
}
app.use(unknownEndpoint)

// portti
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})