const tokenKey = 'accessToken'

export const setToken = (res, token) => {
  res.cookie(tokenKey, token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict',
  })
}

export const removeToken = (res) => {
  res.clearCookie(tokenKey)
}
