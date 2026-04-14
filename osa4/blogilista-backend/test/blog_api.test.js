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

after(async () => {
    await mongoose.connection.close()
})