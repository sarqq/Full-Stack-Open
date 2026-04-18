const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

userRouter.get('/', async (request, response) => {
   const users = await User.find({}).populate('blogs', {
      title: 1, author: 1, url: 1, likes: 1
   })
   response.json(users)
})

// uuden käyttäjän lisäys
userRouter.post('/', async (request, response) => {
   const {username, name, password} = request.body

   if (!username || !password) {
      return response.status(400).json({error: 'Username or password missing.'})
   }
   else if (username.length < 3 || password.length < 3) {
      return response.status(400).json({
         error: 'Username and password must be at least 3 characters long'
      })
   }

   const hashed = await bcrypt.hash(password, 10)
   const newUser = new User({username, name, passwordHash: hashed})
   
   const savedUser = await newUser.save()
   response.status(201).json(savedUser)
})

module.exports = userRouter