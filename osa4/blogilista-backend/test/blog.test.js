const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// testidataa
const bloglist_one = [
   {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
   }
]

const bloglist_n = [
   {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
   },
   {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
   },
   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
   },
   {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
   },
   {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
   },
   {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
   }
]

// -----

test('dummy returns 1', () => {
   const blogs = []

   assert.strictEqual(listHelper.dummy(blogs), 1)
})

// 4.4: totalLikes-funktion testeri
describe('Total likes', () => {
   test('of an empty list -> 0', () => {
      assert.strictEqual(listHelper.totalLikes([]), 0)
   })

   test('of a size 1 list -> blog.likes', () => {
      assert.strictEqual(listHelper.totalLikes(bloglist_one), 5)
   })

   test('of a size n list-> sum(b1.likes .. bn.likes)', () => {
      assert.strictEqual(listHelper.totalLikes(bloglist_n), 36)
   })
})

// 4.5: favoriteBlog-funktion testeri
describe('Blog with most likes', () => {
   test('in an empty list -> null', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
   })

   test('in a size 1 list -> blogs[0]', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog(bloglist_one), bloglist_one[0])
   })

   test('in a size n list-> max(b1.likes .. bn.likes)', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog(bloglist_n), bloglist_n[2])
   })
})

// 4.6: mostBlogs-funktion testeri
describe('Author with most blogs', () => {
   test('in an empty list -> \"N/A\"', () => {
      assert.deepStrictEqual(
         listHelper.mostBlogs([]),
         {author: "N/A", blogs: 0}
      )
   })

   test('in a size 1 list -> blogs[0].author', () => {
      assert.deepStrictEqual(
         listHelper.mostBlogs(bloglist_one),
         {author: bloglist_one[0].author, blogs: 1}
      )
   })

   test('in a size n list-> max(b1.likes .. bn.likes)', () => {
      assert.deepStrictEqual(
         listHelper.mostBlogs(bloglist_n),
         {author: "Robert C. Martin", blogs: 3}
      )
   })
})