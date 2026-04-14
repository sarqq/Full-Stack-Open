const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// palauttaa kaikki blogit
blogRouter.get('/', (request, response) => {
   Blog.find({}).then(blogs => {
      response.json(blogs)
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

// 4.14: blogin päivitys
blogRouter.put('/:id', (request, response) => {
   const updated = request.body
    
   Blog.findById(request.params.id).then(target => {
      if(!target){
         return response.status(404)
      }

      target.title = updated.title
      target.author = updated.author
      target.url = updated.url
      target.likes = updated.likes | 0

      return target.save().then((updatedEntry) => {
         response.status(204).json(updatedEntry)
      })
   })
})

module.exports = blogRouter