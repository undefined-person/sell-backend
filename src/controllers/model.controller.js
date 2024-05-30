import Router from 'express'
import { check, validationResult } from 'express-validator'
import { upload } from '../utils/uploadFile.js'
import { upload3DModel, delete3DModel, get3DModel, get3DModels } from '../services/model.service.js'
import { isErrorObject } from '../utils/isErrorObject.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'model', maxCount: 5 },
  ]),
  [
    check('name', 'Name must be at least 3 characters long and less than 50').isLength({ min: 3, max: 50 }),
    check('price', 'Price must be a number').isNumeric(),
    check('description', 'Description must be at least 3 characters long and less than 1000').isLength({
      min: 3,
      max: 1000,
    }),
    check('animated', 'Animated must be a boolean').isBoolean(),
    check('rigged', 'Rigged must be a boolean').isBoolean(),
    check('vrArLowPoly', 'VrArLowPoly must be a boolean').isBoolean(),
    check('pbr', 'Pbr must be a boolean').isBoolean(),
    check('textures', 'Textures must be a boolean').isBoolean(),
    check('materials', 'Materials must be a boolean').isBoolean(),
    check('uvMapping', 'UvMapping must be a boolean').isBoolean(),
    check('unwrappedUVs', 'UnwrappedUVs must be a boolean').isBoolean(),
    check('pluginsUsed', 'PluginsUsed must be a boolean').isBoolean(),
    check('readyFor3DPrinting', 'ReadyFor3DPrinting must be a boolean').isBoolean(),
    check('vertices', 'Vertices must be a number').isNumeric(),
    check('polygons', 'Polygons must be a number').isNumeric(),
    check('geometry', 'Geometry must be a string').isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      const modelFiles = req.files['model']
      const imagesFiles = req.files['images']

      if (!modelFiles) {
        return res.status(400).json({ message: 'Model file is required' })
      }

      if (!imagesFiles) {
        return res.status(400).json({ message: 'Images files are required' })
      }

      const {
        name,
        price,
        description,
        animated,
        rigged,
        vrArLowPoly,
        pbr,
        textures,
        materials,
        uvMapping,
        unwrappedUVs,
        pluginsUsed,
        readyFor3DPrinting,
        vertices,
        polygons,
        geometry,
      } = req.body

      const modelData = {
        name,
        price,
        description,
        animated,
        rigged,
        vrArLowPoly,
        pbr,
        textures,
        materials,
        uvMapping,
        unwrappedUVs,
        pluginsUsed,
        readyFor3DPrinting,
        vertices,
        polygons,
        geometry,
      }

      const createdModel = await upload3DModel(modelData, modelFiles, imagesFiles)
      res.json(createdModel)
    } catch (e) {
      console.log(e)
      if (isErrorObject(e)) {
        res.status(500).json({ message: e.message || 'Server Error' })
      } else {
        res.status(500).json({ message: e || 'Server Error' })
      }
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const { page } = req.query
    const models = await get3DModels(page)
    res.json(models)
  } catch (e) {
    console.log(e)
    if (isErrorObject(e)) {
      res.status(500).json({ message: e.message || 'Server Error' })
    } else {
      res.status(500).json({ message: e || 'Server Error' })
    }
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const model = await get3DModel(id)
    res.json(model)
  } catch (e) {
    console.log(e)
    if (isErrorObject(e)) {
      res.status(500).json({ message: e.message || 'Server Error' })
    } else {
      res.status(500).json({ message: e || 'Server Error' })
    }
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await delete3DModel(id)
    res.json({ message: 'Model deleted' })
  } catch (e) {
    console.log(e)
    if (isErrorObject(e)) {
      res.status(500).json({ message: e.message || 'Server Error' })
    } else {
      res.status(500).json({ message: e || 'Server Error' })
    }
  }
})

export default router
