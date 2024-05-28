import mongoose, { model } from 'mongoose'

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  animated: {
    type: Boolean,
    default: false,
  },
  rigged: {
    type: Boolean,
    default: false,
  },
  vrArLowPoly: {
    type: Boolean,
    default: false,
  },
  pbr: {
    type: Boolean,
    default: false,
  },
  geometry: {
    type: String,
    default: 'Polygon mesh',
  },
  polygons: {
    type: Number,
    required: true,
  },
  vertices: {
    type: Number,
    required: true,
  },
  textures: {
    type: Boolean,
    default: false,
  },
  materials: {
    type: Boolean,
    default: false,
  },
  uvMapping: {
    type: Boolean,
    default: false,
  },
  unwrappedUVs: {
    type: Boolean,
    default: false,
  },
  pluginsUsed: {
    type: Boolean,
    default: false,
  },
  readyFor3DPrinting: {
    type: Boolean,
    default: false,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  model: [
    {
      type: String,
      required: true,
    },
  ],
})

export const Model = mongoose.model('Model', modelSchema)
