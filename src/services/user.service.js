import { User } from '../schema/user.schema.js'

export const createUser = async (username, password) => {
  return await User.create({
    username,
    password,
  })
}

export const getUserByUsername = async (username) => {
  return await User.findOne({ username })
}
