const dummy = (blogs) => {
   return 1
}

// 4.4: palauttaa listan blogien tykkäysten summan
const totalLikes = (blogs) => {
   // tyhjä blogilista -> 0
   if (!blogs) {
      return 0
   }

   const sum = blogs.reduce((acc, curr) => acc + curr.likes, 0)
   return sum
}

module.exports = {dummy, totalLikes}