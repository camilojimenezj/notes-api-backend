const bcrypt = require('bcrypt')
const User = require('../models/User')
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('notes', {
      content: 1,
      date: 1,
      important: 1
    })
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      name,
      passwordHash
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
