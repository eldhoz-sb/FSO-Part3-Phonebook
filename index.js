const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(morgan('tiny'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  
  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const date = new Date()
  const total = persons.length
  console.log(total, date)
  response.send(
    `<p>Phonebook has info for ${total} people</p>
    <p>${date}`
  )

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const range = 10000
  return Math.floor(Math.random() * range);
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (!body.name){
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  const checkName = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())

  if(checkName) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port${PORT}`)
})