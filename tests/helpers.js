const request = require('supertest')
const { app } = require('../index')
const api = request(app)

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

module.exports = {
  initialNotes,
  api,
  getAllContentFromNotes
}
