const logger = require('./logger')

// catch-all tuntemattomille kutsuille
const unknownEndpoint = (request, response) => {
   response.status(404).send({error: 'Unknown endpoint.'}).end()
}

// 3.16: middleware virheidenkäsittelylle
const errorHandler = (error, request, response, next) => {
   logger.error(error.message)
   
   if(error.name === 'CastError') {
      return response.status(400).send({error: 'Malformed id'})
   }
   else if(error.name === 'ValidationError') {
      return response.status(400).json({error: error.message})
   }

   next(error)
}

module.exports = { unknownEndpoint, errorHandler }