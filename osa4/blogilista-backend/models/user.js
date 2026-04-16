const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
   username: {
      type: String,
      minlength: 3,
      required: [true, 'Username required'],
      unique: true
   },
   name: String,
   passwordHash: {
      type: String,
      required: [true, 'Password required']
   },
   blogs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
   }]
})

// formaatin muokkaus
userSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
   }
})

module.exports = mongoose.model('User', userSchema)