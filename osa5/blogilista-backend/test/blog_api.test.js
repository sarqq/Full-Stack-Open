/* 4.8: SuperTest-kirjaston asynkroniset testit */
const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const testUtils = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
   await Blog.deleteMany({})
   await User.deleteMany({})

   await Blog.insertMany(testUtils.initialBlogs)

   // luo root-käyttäjän kantaan   
   const passHash = await bcrypt.hash('sekret', 10)
   const user = new User({username: 'root', name: 'Superuser', passwordHash: passHash})   
   await user.save()
})

/* Blog-modelin testit */
describe('GET /api/blogs', () => { 
   test('Blogs are returned as JSON', async () => {
      await api.get('/api/blogs').expect(200).expect('Content-Type', 'application/json; charset=utf-8')
   })

   test('All blogs are returned', async () => {
      const initialBlogs = testUtils.initialBlogs
      const response = await api.get('/api/blogs')
        
      assert.strictEqual(response.body.length, initialBlogs.length)
   })

   // 4.9: palautettujen blogien tunnistekenttä id eikä _id
   test('Returned blogs have a property \'id\', instead of default \'_id\'', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.every(blog => Object.hasOwn(blog, "id") && !Object.hasOwn(blog, "_id")), true)
   })
})

describe('POST /api/blogs', () => {
   // 4.10: uuden blogin lisäys
   test('New blog added successfully', async () => {
      const initialBlogs = await testUtils.blogsInDB()
      const users = await testUtils.usersInDB()

      const newBlog = {
         title: 'testiblogi',
         author: 'mie',
         url: 'https://hienourli.hienodomain',
         likes: 5,
         userId: users[0].id
      }

      await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', 'application/json; charset=utf-8')

      const currentBlogs = await testUtils.blogsInDB()
      const blogTitles = currentBlogs.map(blog => blog.title)
      
      assert.strictEqual(currentBlogs.length, (initialBlogs.length+1))
      assert(blogTitles.includes(newBlog.title))
   })

   // 4.11: tyhjä likes-kenttä -> likes = 0
   test('Default value 0 for property \'likes\'', async () => {
      const users = await testUtils.usersInDB()
      const partialBlog = {
         title: 'test411',
         author: 'mie',
         url: 'joku.urli',
         userId: users[0].id
      }
      
      const response = await api.post('/api/blogs').send(partialBlog).expect(201)
      assert.strictEqual(response.body.likes, 0)
   })

   // 4.12: tyhjät title- ja url-kentät -> statuskoodi 400
   test('Adding blog without required fields -> 400', async () => {
      const initialBlogs = await testUtils.blogsInDB()
      const users = await testUtils.usersInDB()
      
      const partialBlog1 = {
         title: 'testi412',
         author: 'mie',
         userId: users[0].id
      }

      const partialBlog2 = {
         author: 'mie',
         url: 'upee.urli',
         userId: users[0].id
      }

      const response1 = await api.post('/api/blogs').send(partialBlog1).expect(400)
      const response2 = await api.post('/api/blogs').send(partialBlog2).expect(400)

      const currentBlogs = await testUtils.blogsInDB()

      assert.strictEqual((response1.status === 400 && response2.status === 400), true)
      assert.strictEqual(currentBlogs.length, initialBlogs.length)
   })
})

describe('DELETE /api/blogs/:id', () => {
   // 4.13: yksittäisen blogin poiston testaus
   test('Blog deleted successfully', async () => {
      const initialBlogs = await testUtils.blogsInDB()
      const testId = initialBlogs[0].id

      await api.delete(`/api/blogs/${testId}`).expect(204)
      
      const currentBlogs = await testUtils.blogsInDB()
      assert.strictEqual(currentBlogs.length, initialBlogs.length-1)
      assert(!currentBlogs.includes(testId))
   })
})

describe('PUT /api/blogs/:id', () => {
   // 4.14: yksittäisen blogin muokkauksen testaus
   test('Updating object properties', async () => {
      const updatedValue = {likes: 2}
      const initialBlogs = await testUtils.blogsInDB()
      const testId = initialBlogs[0].id
      
      await api.put(`/api/blogs/${testId}`).send(updatedValue).expect(204)
      
      const currentBlogs = await testUtils.blogsInDB()
      const updatedBlog = currentBlogs.find(blog => {
         return blog.id === testId
      })

      assert.strictEqual(updatedBlog.likes, updatedValue.likes)
   })
})

/* User-modelin testit */
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