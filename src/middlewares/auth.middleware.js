import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  const token = req.cookies['accessToken']

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const sessionInfo = jwt.verify(token, process.env.ACCESS_TOKEN)

    req.session = sessionInfo

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
