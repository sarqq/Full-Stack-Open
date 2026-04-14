/* 4.8: SuperTest-kirjaston asynkroniset testit */
const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const testdata = require('../utils/test_data')
const Blog = require('../models/blog')

const app = require('../app')
const api = supertest(app)

const bloglist = testdata.initialBlogs

describe('GET /api/blogs', () => {
   beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(testdata.initialBlogs)
   })
    
   test('Blogs are returned as JSON', async () => {
      await api.get('/api/blogs').expect(200).expect('Content-Type', 'application/json; charset=utf-8')
   })

   test('All blogs are returned', async () => {
      const response = await api.get('/api/blogs')
        
      assert.strictEqual(response.body.length, bloglist.length)
   })

   // 4.9: palautettujen blogien tunnistekenttä id eikä _id
   test('Returned blogs have a property \'id\', instead of default \'_id\'', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.every(blog => Object.hasOwn(blog, "id") && !Object.hasOwn(blog, "_id")), true)
   })
})

describe('POST /api/blogs', () => {
   beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(testdata.initialBlogs)
   })

   // 4.10: uuden blogin lisäys
   test('New blog added successfully', async () => {
      await api.post('/api/blogs').send(testdata.newBlog).expect(201)
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, (bloglist.length+1))
   })

   // 4.11: tyhjä likes-kenttä -> likes = 0
   test('Default value 0 for property \'likes\'', async () => {
      const partialBlog = {
         title: 'test411',
         author: 'mie',
         url: 'joku.urli'
      }
      
      const response = await api.post('/api/blogs').send(partialBlog).expect(201)
      assert.strictEqual(response.body.likes, 0)
   })

   // 4.12: tyhjät title- ja url-kentät -> statuskoodi 400
   test('Adding blog without required fields -> 400', async () => {
      const partialBlog1 = {
         title: 'testi412',
         author: 'mie'
      }

      const partialBlog2 = {
         author: 'mie',
         url: 'upee.urli'
      }

      const response1 = await api.post('/api/blogs').send(partialBlog1).expect(400)
      const response2 = await api.post('/api/blogs').send(partialBlog2).expect(400)

      assert.strictEqual((response1.status === 400 && response2.status === 400), true)
   })
})

describe ('DELETE /api/blogs/:id', () => {
   // 4.13: yksittäisen blogin poiston testaus
   test('Blog deleted successfully', async () => {
      const testId = bloglist[0]._id

      await api.delete(`/api/blogs/${testId}`).expect(204)
      
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, bloglist.length-1)
   })
})

after(async () => {
   await mongoose.connection.close()
})