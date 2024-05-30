import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  models: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Model',
    },
  ],
})

export const Customer = mongoose.model('Customer', customerSchema)
