require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
/* const morgan = require('morgan') */

const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
/* app.use(morgan('tiny')) */

// routes

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(notFound)

app.use(handleErrors)

/* const PORT = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT */
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { server, app }
