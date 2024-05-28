import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { createUser, getUserByUsername } from './user.service.js'

export const signIn = async (username, password) => {
  const user = await getUserByUsername(username)

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    throw new Error('Invalid credentials')
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })

  return { accessToken }
}

export const signUp = async (username, password) => {
  const candidate = await getUserByUsername(username)

  if (candidate) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await createUser(username, hashedPassword)

  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })

  return { accessToken }
}
