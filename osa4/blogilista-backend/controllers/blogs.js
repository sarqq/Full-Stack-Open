const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// palauttaa kaikki blogit
blogRouter.get('/', async (request, response) => {
   const blogs = await Blog.find({})
   
   response.json(blogs)
})

// palauttaa yhden blogin
blogRouter.get('/:id', async (request, response) => {
   const id = request.params.id
   const target = await Blog.findById(id)

   return (target)
      // blogi löytyy -> 200
      ? response.status(200).json(target)
      // ei löytynyt -> 404
      : response.status(404).json({error: `Blog with id ${id} not found.`})
})

// 4.10: blogin lisäys
blogRouter.post('/', async (request, response) => {
   const blog = new Blog(request.body)

   if (!blog.title | !blog.url) {
      return response.status(400).end()
   }

   const newBlog = await blog.save()
   response.status(201).json(newBlog)
})

// 4.13: blogin poisto
blogRouter.delete('/:id', async (request, response) => {
   await Blog.findByIdAndDelete(request.params.id)
   
   // blogi löytyi, poisto -> 204
   response.status(204).end()
})

// 4.14: blogin likes-kentän päivitys
blogRouter.put('/:id', async (request, response) => {
   const updatedLikes = request.body.likes
    
   const target = await Blog.findByIdAndUpdate(request.params.id, {likes: updatedLikes})
   
   return (target)
      ? response.status(204).json(target)
      : response.status(404).end()
})

module.exports = blogRouter