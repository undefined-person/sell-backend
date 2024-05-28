import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import fs from 'fs'

import { Model } from '../schema/model.schema.js'

const extractVerticesAndPolygons = (file) => {
  const data = fs.readFileSync(file.path, 'utf8')
  const loader = new OBJLoader()
  const object = loader.parse(data)

  const vertices = []
  const polygons = []

  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      const geometry = new THREE.Geometry().fromBufferGeometry(child.geometry)
      vertices.push(...geometry.vertices)
      polygons.push(...geometry.faces)
    }
  })
  return { vertices, polygons }
}

export const upload3DModel = async (model, modelFiles, imagesFiles) => {
  const upload3dModel = {
    ...model,
    images: imagesFiles.map((file) => file.path.replace('public', '')),
    model: modelFiles.map((file) => file.path.replace('public', '')),
    vertices: 2,
    polygons: 2,
  }
  const createdModel = await Model.create(upload3dModel)
  return createdModel
}

export const get3DModels = async (page) => {
  const limit = 10
  const skip = (page - 1) * limit

  const models = await Model.find().skip(skip).limit(limit).select('name images price').sort({
    publishDate: -1,
  })

  const isNextPage = (await Model.countDocuments()) > page * limit
  const isPrevPage = page > 1

  const modelsData = models
    .map((model) => model.toObject())
    .map((model) => {
      model.images = model.images[0]
      return model
    })

  return { models: modelsData, isNextPage, isPrevPage }
}

export const get3DModel = async (id) => {
  const model = await Model.findById(id)
  return model
}

export const delete3DModel = async (id) => {
  const model = await Model.findById(id)

  if (!model) {
    throw new Error('Model not found')
  }

  await model.remove()
}

export const update3DModel = async (id, modelData) => {
  const model = await Model.findById(id)

  if (!model) {
    throw new Error('Model not found')
  }

  Object.assign(model, modelData)

  await model.save()

  return model
}
