import { Model } from '../schema/model.schema.js'

export const upload3DModel = async (model, modelFiles, imagesFiles) => {
  const upload3dModel = {
    ...model,
    images: imagesFiles.map((file) => file.path.replace('public', '')),
    model: modelFiles.map((file) => file.path.replace('public', '')),
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
  await Model.findByIdAndDelete(id)
}
