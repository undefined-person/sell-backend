import Router from 'express'
import { check, validationResult } from 'express-validator'

import { signIn, signUp, buyModel, getCustomersModels } from '../services/customer.service.js'
import { setToken } from '../services/cookie.service.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { isErrorObject } from '../utils/isErrorObject.js'

const router = Router()

router.post(
  '/sign-in',
  [
    check('username', 'Username must be at least 3 characters long and less than 20').isLength({
      min: 3,
      max: 20,
    }),
    check('password', 'Password must be at least 6 characters long and less than 40').isLength({
      min: 6,
      max: 40,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      const { username, password } = req.body
      const { accessToken } = await signIn(username, password)

      setToken(res, accessToken)

      res.status(200).json({ message: 'Signed in' })
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

router.post(
  '/sign-up',
  [
    check('username', 'Username must be at least 3 characters long and less than 20').isLength({
      min: 3,
      max: 20,
    }),
    check('password', 'Password must be at least 6 characters long and less than 40').isLength({
      min: 6,
      max: 40,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      const { username, password } = req.body
      const { accessToken } = await signUp(username, password)

      setToken(res, accessToken)
      res.status(201).json({ message: 'Signed up' })
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

router.get('/session', authMiddleware, async (req, res) => {
  try {
    res.status(200).json({ session: req.session })
  } catch (e) {
    console.log(e)
    if (isErrorObject(e)) {
      res.status(500).json({ message: e.message || 'Server Error' })
    } else {
      res.status(500).json({ message: e || 'Server Error' })
    }
  }
})

router.post('/buy-model', [check('id', 'Model ID is required').isMongoId()], authMiddleware, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { id } = req.body
    const { userId } = req.session
    const result = await buyModel(id, userId)

    res.json(result)
  } catch (e) {
    console.log(e)
    if (isErrorObject(e)) {
      res.status(500).json({ message: e.message || 'Server Error' })
    } else {
      res.status(500).json({ message: e || 'Server Error' })
    }
  }
})

router.get('/models', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.session
    const models = await getCustomersModels(userId)

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

export default router
