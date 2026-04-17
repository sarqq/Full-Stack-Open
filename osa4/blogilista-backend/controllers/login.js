/* 4.18: tokenit */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
   const {username, password} = request.body

   const user = await User.findOne({username})
   const passOk = (user === null)
      ? false
      : await bcrypt.compare(password, user.passwordHash)

   if (!(user && passOk)) {
      return response.status(401).json({error: 'Invalid username or password.'})
   }

   const tokenUser = {
      username: user.username,
      id: user.id
   }

   const token = jwt.sign(tokenUser, process.env.SECRET)

   response.status(200).send({
      token,
      username: user.username,
      name: user.name
   })
})

module.exports = loginRouter