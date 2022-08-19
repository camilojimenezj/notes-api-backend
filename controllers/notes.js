const Note = require('../models/Note')
const User = require('../models/User')
const authorize = require('../middleware/authorize')
const notesRouter = require('express').Router()

notesRouter.get('/', async (req, res, next) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.status(200).json(notes)
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id).then(note => {
    note ? res.status(200).json(note) : res.status(404).end()
  }).catch(err => {
    next(err)
  })
})

notesRouter.delete('/:id', authorize, (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndRemove(id).then(result => {
    res.status(204).end()
  }).catch(err => {
    next(err)
  })
})

notesRouter.post('/', authorize, async (req, res, next) => {
  try {
    const { content, important = false } = req.body
    const userId = req.userId

    const user = await User.findById(userId)

    const newNote = new Note({
      content,
      important,
      date: new Date().toISOString(),
      user: user._id
    })

    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

notesRouter.put('/:id', authorize, (req, res, next) => {
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

module.exports = notesRouter
