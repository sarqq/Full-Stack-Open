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

app.get('/', (request, response) => {
    response.sendFile('index.html', {root: 'dist'})
})

// 3.1 & 3.13: koko puhelinluettelon palautus
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.status(200).json(persons)
    })
})

// 3.2: puhelinluettelon metatietojen palautus
app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        response.status(200).send(
            `<p>Current phonebook size: ${count} people.</p>
            <p>Request made at: ${new Date().toUTCString()}</p>`
        )
    })
})

// 3.3: yksittäisen puhelintiedon haku
app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id).then((found) => {        
        return (found)
            // henkilö löytyi -> 200, palautetaan henkilö
            ? response.status(200).json(found)
            // ei löytynyt -> 404
            : response.status(404).json({error: `Person with id ${id}  not found.`})
    })
    .catch((error) => next(error))
})

// 3.4: yksittäisen puhelintiedon poisto
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        // henkilö löytyi, poisto -> 204
        response.status(204).end()
    })
    .catch((error) => next(error))
})

// 3.5: uuden puhelintiedon lisäys
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const newEntry = new Person({
        name: body.name,
        number: body.number,
    })

    return newEntry.save().then(savedEntry => {
        response.locals.createdObject = savedEntry
        response.status(201).json(savedEntry)
    })
    .catch(error => next(error))
})

// 3.6: jo olemassaolevan puhelintiedon lisäys
app.put('/api/persons/:id', (request, response) => {
    const {name, number} = request.body
    
    Person.findById(request.params.id).then(target => {
        if(!target){
            return response.status(404).json({error: `Person with id ${request.params.id} not found.`})
        }

        console.log("Target found")
        target.name = name
        target.number = number

        return target.save().then((updatedEntry) => {
            response.json(updatedEntry)
        })
    })
    .catch(error => {
        console.log(error)
        response.status(500).json({error: error.message}).end()
    })
})

// catch-all tuntemattomille kutsuille
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "Unknown endpoint."}).end()
}
app.use(unknownEndpoint)

// 3.16: middleware virheidenkäsittelylle
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    
    if(error.name === "CastError") {
        return response.status(400).send({error: "Malformed id"})
    }
    else if(error.name === "ValidationError") {
        return response.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

// portti
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})