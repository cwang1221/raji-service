import { sign } from '../../services/jwt.js'
import { success } from '../../services/response.js'
import config from '../../config.js'

const env = config.env

export const login = function ({ user }, res, next) {
  sign(user._id, { expiresIn: 60 * 60 })
    .then(token => {
      res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 60,
        sameSite: env === 'production' ? 'none' : 'lax',
        secure: env === 'production'
      })
      return { token, user: user.view(true) }
    })
    .then(success(res, 201))
    .catch(next)
}
