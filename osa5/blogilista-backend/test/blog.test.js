const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const testdata = require('./test_helper')

const bloglist = testdata.initialBlogs

test('dummy returns 1', () => {
   assert.strictEqual(listHelper.dummy([]), 1)
})

// 4.4: totalLikes-funktion testeri
describe('Total likes', () => {
   test('of an empty list -> 0', () => {
      assert.strictEqual(listHelper.totalLikes([]), 0)
   })

   test('of a size 1 list -> blog.likes', () => {
      assert.strictEqual(listHelper.totalLikes([bloglist[0]]), 7)
   })

   test('of a size n list-> sum(b1.likes .. bn.likes)', () => {
      assert.strictEqual(listHelper.totalLikes(bloglist), 36)
   })
})

// 4.5: favoriteBlog-funktion testeri
describe('Blog with most likes', () => {
   test('in an empty list -> null', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
   })

   test('in a size 1 list -> blogs[0]', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog([bloglist[0]]), bloglist[0])
   })

   test('in a size n list-> max(b1.likes .. bn.likes)', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog(bloglist), bloglist[2])
   })
})

// 4.6: mostBlogs-funktion testeri
describe('Author with most blogs', () => {
   test('in an empty list -> {\"N/A\": 0}', () => {
      assert.deepStrictEqual(
         listHelper.mostBlogs([]),
         {author: "N/A", blogs: 0}
      )
   })

   test('in a size 1 list -> blogs[0].author', () => {
      assert.deepStrictEqual(
         listHelper.mostBlogs([bloglist[0]]),
         {author: bloglist[0].author, blogs: 1}
      )
   })

   test('in a size n list-> max(count(b1.author) .. count(bn.author))', () => {
      assert.deepStrictEqual(
         listHelper.mostBlogs(bloglist),
         {author: "Robert C. Martin", blogs: 3}
      )
   })
})

// 4.7: mostLikes-funktion testeri
describe('Author with most likes across blogs', () => {
   test('in an empty list -> {\"N/A\": 0}', () => {
      assert.deepStrictEqual(
         listHelper.mostLikes([]),
         {author: "N/A", likes: 0}
      )
   })

   test('in a size 1 list -> {blogs[0].author: blogs[0].likes}', () => {
      assert.deepStrictEqual(
         listHelper.mostLikes([bloglist[0]]),
         {author: bloglist[0].author, likes: bloglist[0].likes}
      )
   })

   test('in a size n list-> max(b1.likes .. bn.likes)', () => {
      assert.deepStrictEqual(
         listHelper.mostLikes(bloglist),
         {author: "Edsger W. Dijkstra", likes: 17}
      )
   })
})