const blog = require("../models/blog")
const _ = require('lodash')

const dummy = (blogs) => {
   return 1
}

// 4.4: palauttaa listan blogien tykkäysten summan
const totalLikes = (blogs) => {
   // tyhjä blogilista -> 0
   if (!blogs || blogs.length === 0) {
      return 0
   }

   const sum = blogs.reduce((acc, curr) => {
      return acc + curr.likes
   }, 0)
   
   return sum
}

// 4.5: palauttaa blogin, jolla eniten tykkäyksiä
const favoriteBlog = (blogs) => {
   // tyhjä blogilista
   if (!blogs || blogs.length === 0) {
      return null
   }

   const favorite = blogs.reduce((prev, curr) => {
      return (prev.likes > curr.likes) ? prev : curr
   })

   return favorite
}

// 4.6: palauttaa eniten blogeja kirjoittaneen nimen ja blogien määrän
const mostBlogs = (blogs) => {
   // tyhjä blogilista
   if (!blogs || blogs.length === 0) {
      return {author: "N/A", blogs: 0}
   }

   // kerää blogit author-attribuutin mukaan author-n -pareiksi
   // ja etsii niistä maksimin
   const topAuthor = _(blogs).countBy('author')
      .toPairs()
      .maxBy(([_, count]) => count)

   return {author: topAuthor[0], blogs: topAuthor[1]}
}

// 4.7: palauttaa eniten tykkäyksiä saaneen kirjoittaneen nimen ja tykkäyksien määrän
const mostLikes = (blogs) => {
   // tyhjä blogilista
   if (!blogs || blogs.length === 0) {
      return {author: "N/A", likes: 0}
   }

   // kerää blogit author-attribuutin mukaan author-[blogit] -mapiksi
   // ja etsii arvolistan summan maksimin
   const topLikes = _(blogs).groupBy('author')
      .map((items, author) => ({
         author, likes: _.sumBy(items, "likes")
      }))
      .maxBy("likes")

   return topLikes
}

module.exports = {
   dummy,
   totalLikes,
   favoriteBlog,
   mostBlogs,
   mostLikes
}