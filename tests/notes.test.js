const mongoose = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { initialNotes, api, getAllContentFromNotes, initialUser, getUsers } = require('./helpers')

let token = ''

beforeAll(async () => {
  await User.deleteMany({})
  const { password, ...newUser } = initialUser
  const user = new User({
    ...newUser,
    passwordHash: await bcrypt.hash(password, 10)
  })
  await user.save()
  const login = { username: initialUser.username, password: initialUser.password }

  const res = await api
    .post('/api/login')
    .send(login)

  token = `Bearer ${res.body.token}`
})

beforeEach(async () => {
  await Note.deleteMany({})
  const notesToInsert = []
  initialNotes.forEach((note, i) => {
    notesToInsert[i] = new Note(note)
  })
  await Note.insertMany(notesToInsert)
})

describe('get', () => {
  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('some note is about midu', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('Aprendiendo testing con midu')
  })
})

describe('post', () => {
  test('a valid note can be added', async () => {
    const user = await getUsers()
    const newNote = {
      content: 'proximamente solo en cines',
      userId: user[0].id
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /json/)
    const { contents, response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('a note without content is not added', async () => {
    const user = await getUsers()
    const newNote = {
      important: false,
      userId: user[0].id
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .set({ Authorization: token })
      .expect(400)
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('delete', () => {
  test('a note can be deleted', async () => {
    const { response } = await getAllContentFromNotes()
    const noteId = response.body[0].id

    await api
      .delete(`/api/notes/${noteId}`)
      .set({ Authorization: token })
      .expect(204)

    const result = await getAllContentFromNotes()
    expect(result.response.body).toHaveLength(initialNotes.length - 1)
  })
})

describe('put', () => {
  test('a note can be updated', async () => {
    const { response } = await getAllContentFromNotes()
    const noteId = response.body[0].id

    await api
      .put(`/api/notes/${noteId}`)
      .send({ content: 'nota actualizada' })
      .set({ Authorization: token })
      .expect(200)

    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('nota actualizada')
  })
})

describe('get one', () => {
  test('get a note by id', async () => {
    const { response } = await getAllContentFromNotes()
    const noteId = response.body[0].id

    const result = await api
      .get(`/api/notes/${noteId}`)
      .expect(200)
    expect(result.body.content).toBe(response.body[0].content)
  })
  test('a wrong id can not get a note', async () => {
    await api
      .get('/api/notes/123456')
      .expect(400)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
