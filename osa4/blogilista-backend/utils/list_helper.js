const dummy = (blogs) => {
   return 1
}

// 4.4: palauttaa listan blogien tykkäysten summan
const totalLikes = (blogs) => {
   // tyhjä blogilista -> 0
   if (!blogs) {
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

module.exports = {dummy, totalLikes, favoriteBlog}