const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns 1', () => {
    const blogs = []
    
    assert.strictEqual(listHelper.dummy(blogs), 1)
})