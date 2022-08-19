const request = require('supertest')
const { app } = require('../index')
const api = request(app)
const User = require('../models/User')

const initialUser = {
  username: 'camilojj12',
  name: 'camilo',
  password: 'hola123'
}

const initialNotes = [
  {
    content: 'Aprendiendo testing con midu',
    important: true,
    date: new Date()
  },
  {
    content: 'Holaa mundo',
    important: true,
    date: new Date()
  }
]
const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  initialNotes,
  api,
  getAllContentFromNotes,
  getUsers,
  initialUser
}
