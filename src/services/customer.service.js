import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Customer } from '../schema/customer.schema.js'
import { Model } from '../schema/model.schema.js'

export const signIn = async (username, password) => {
  const customer = await Customer.findOne({ username })

  if (!customer) {
    throw new Error('Invalid credentials')
  }

  const valid = await bcrypt.compare(password, customer.password)

  if (!valid) {
    throw new Error('Invalid credentials')
  }

  const accessToken = jwt.sign({ userId: customer._id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })

  return { accessToken }
}

export const signUp = async (username, password) => {
  const candidate = await Customer.findOne({ username })

  if (candidate) {
    throw new Error('Customer already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const customer = await Customer.create({ username, password: hashedPassword })

  const accessToken = jwt.sign({ userId: customer._id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })

  return { accessToken }
}

export const buyModel = async (modelId, userId) => {
  const customer = await Customer.findById(userId)

  if (!customer) {
    throw new Error('Customer not found')
  }

  if (customer.models.includes(modelId)) {
    throw new Error('Model already bought')
  }

  customer.models.push(modelId)

  await customer.save()

  return { message: 'Model bought' }
}

export const getCustomersModels = async (userId) => {
  const customer = await Customer.findById(userId)

  if (!customer) {
    throw new Error('Customer not found')
  }

  const modelsIds = customer.models

  const models = await Model.find({ _id: { $in: modelsIds } })

  return models
}
