const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers, initialUser } = require('./helpers')
const { server } = require('../index')
const { default: mongoose } = require('mongoose')

beforeEach(async () => {
  await User.deleteMany({})
  const { password, ...newUser } = initialUser
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({
    ...newUser,
    passwordHash
  })
  await user.save()
})

describe('post', () => {
  test('works as expected creating a fresh user', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'midudev',
      name: 'miguel',
      password: 'tw1tch'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })
  test('a user with an existing username doesnt get added', async () => {
    const usersAtStart = await getUsers()

    await api
      .post('/api/users')
      .send(initialUser)
      .expect(400)
      .expect('Content-Type', /json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
