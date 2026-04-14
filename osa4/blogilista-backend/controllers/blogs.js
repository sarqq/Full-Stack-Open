const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
   Blog.find({}).then(blogs => {
      response.json(blogs)
   })
})

blogRouter.post('/', (request, response) => {
   const blog = new Blog(request.body)

   if (!blog.title | !blog.url) {
      return response.status(400).end()
   }

   blog.save().then((result) => {
      response.status(201).json(result)
   })
})

blogRouter.delete('/:id', (request, response) => {
   Blog.findByIdAndDelete(request.params.id).then(() => {
      // blogi löytyi, poisto -> 204
      response.status(204).end()
   })
})

module.exports = blogRouter