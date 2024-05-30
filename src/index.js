import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import mongoose from 'mongoose'

import authController from './controllers/auth.controller.js'
import modelController from './controllers/model.controller.js'
import customerController from './controllers/customer.controller.js'

dotenv.config()

const app = express()

const ADMIN_URI = process.env.ADMIN_URI
const CLIENT_URI = process.env.CLIENT_URI

app.use(express.json())
app.use(
  cors({
    origin: [ADMIN_URI, CLIENT_URI],
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authController)
app.use('/model', modelController)
app.use('/customer', customerController)

mongoose.set('strictQuery', false)

app.listen(process.env.PORT, async () => {
  await mongoose.connect(process.env.DB_URI)
  console.log(`Server is running on port ${process.env.PORT}`)
})
