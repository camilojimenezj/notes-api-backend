require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

// routes

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id).then(note => {
    note ? res.json(note) : res.status(404).end()
  }).catch(err => {
    next(err)
  })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndRemove(id).then(result => {
    res.status(204).end()
  }).catch(err => {
    next(err)
  })
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date().toISOString()
  })
  newNote.save().then(savedNote => {
    res.status(201).json(savedNote)
  })
})

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  const note = req.body
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
    res.status(200).json(result)
  }).catch(err => {
    next(err)
  })
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
