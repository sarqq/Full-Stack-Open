const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// palauttaa kaikki blogit
blogRouter.get('/', (request, response) => {
   Blog.find({}).then(blogs => {
      response.json(blogs)
   })
})

// palauttaa yhden blogin
blogRouter.get('/:id', (request, response) => {
   const id = request.params.id

   Blog.findById(id).then((found) => {        
      return (found)
         // blogi löytyy -> 200
         ? response.status(200).json(found)
         // ei löytynyt -> 404
         : response.status(404).json({error: `Blog with id ${id} not found.`})
   })
})

// 4.10: blogin lisäys
blogRouter.post('/', (request, response) => {
   const blog = new Blog(request.body)

   if (!blog.title | !blog.url) {
      return response.status(400).end()
   }

   blog.save().then((result) => {
      response.status(201).json(result)
   })
})

// 4.13: blogin poisto
blogRouter.delete('/:id', (request, response) => {
   Blog.findByIdAndDelete(request.params.id).then(() => {
      // blogi löytyi, poisto -> 204
      response.status(204).end()
   })
})

// 4.14: blogin likes-kentän päivitys
blogRouter.put('/:id', (request, response) => {
   const updatedLikes = request.body.likes
    
   Blog.findByIdAndUpdate(request.params.id, {likes: updatedLikes}).then(target => {
      if(!target){
         return response.status(404).end()
      }

      return response.status(204).json(target)
   })
})

module.exports = blogRouter