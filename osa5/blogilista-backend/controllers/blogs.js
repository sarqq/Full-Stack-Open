const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

// 4.19: hakee tokenin otsakkeesta
const getToken = request => {
   const auth = request.get('authorization')
   
   if (auth && auth.startsWith('Bearer ')) {
      return auth.replace('Bearer ', '')
   }

   return null
}

// palauttaa kaikki blogit
blogRouter.get('/', async (request, response) => {
   const blogs = await Blog.find({}).populate('user', {
      username: 1, name: 1
   })
   
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
   const body = request.body
   const decodedToken = jwt.verify(getToken(request), process.env.SECRET)

   if(!decodedToken.id) {
      return response.status(401).json({error: 'Invalid token.'})
   }
   else if (!body.title || !body.url) {
      return response.status(400).json({error: 'Missing or invalid title or URL.'})
   }

   // 4.17: liitetään viite käyttäjään
   const user = await User.findById(body.userId)   
   if(!user) {
      return response.status(400).json({error: 'Missing or invalid user ID.'})
   }

   const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ?? 0,
      user: user.id
   })
   
   const savedBlog = await newBlog.save()

   user.blogs = user.blogs.concat(savedBlog)
   await user.save()

   response.status(201).json(savedBlog)
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