const bcrypt = require('bcrypt')
const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const testUtils = require('./test_helper')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

// luo root-käyttäjän tietokantaan
beforeEach(async () => {
   await User.deleteMany({})

   const passHash = await bcrypt.hash('sekret', 10)
   const user = new User({username: 'root', name: 'Superuser', passwordHash: passHash})

   await user.save()
})

describe('POST /api/users', () => {
   test('Create new user', async () => {
      const initialUsers = await testUtils.usersInDB()

      const newUser = {
         username: 'mie',
         name: 'Meikä Meikäläinen',
         password: 'salakala'
      }

      await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', 'application/json; charset=utf-8')

      const currentUsers = await testUtils.usersInDB()
      const usernames = currentUsers.map(user => user.username)

      assert.strictEqual(currentUsers.length, initialUsers.length + 1)
      assert(usernames.includes(newUser.username))
   })

   test('New user with existing username -> error', async () => {
      const initialUsers = await testUtils.usersInDB()
      
      const newUser = {
         username: 'root',
         name: 'Meikä Meikäläinen',
         password: 'salakala'
      }

      const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', 'application/json; charset=utf-8')
      const currentUsers = await testUtils.usersInDB()

      assert(result.body.error.includes('Username must be unique.'))
      assert.strictEqual(currentUsers.length, initialUsers.length)
   })

   test('New user with missing or malformed username or password -> error', async() => {
      const initialUsers = await testUtils.usersInDB()

      const malformed = {
         username: 'test',
         name: 'Putte Puutteellinen',
         password: 'a'
      }

      const missing = {
         name: 'Putte Puutteellinen',
         password: 'salakala'
      }

      await api.post('/api/users').send(malformed).expect(400)
      let currentUsers = await testUtils.usersInDB()
      assert.strictEqual(currentUsers.length, initialUsers.length)

      await api.post('/api/users').send(missing).expect(400)
      currentUsers = await testUtils.usersInDB()
      assert.strictEqual(currentUsers.length, initialUsers.length)
   })
})

after(async () => {
   await mongoose.connection.close()
})