const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(res => {
        console.log(`${ person.name } ${ person.number } added.`)
        mongoose.connection.close()  
    })
} else {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}