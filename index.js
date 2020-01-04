const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
require('dotenv').config()

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<div>Phonebook has info for ${persons.length} people</div> <div>${new Date()}</div>`)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
})

app.delete('/api/persons/:id', (res, req) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).end()
    })
})

app.put('/api/persons/:id', (res, req) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    })
})

const generateId = () => Math.floor(Math.random() * Math.floor(99999))

app.post('/api/persons', (res, req) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const addPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    addPerson.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
        res.json(savedAndFormattedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
