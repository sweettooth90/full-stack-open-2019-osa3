const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        unique: true,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)