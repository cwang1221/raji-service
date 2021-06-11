import express from 'express'
import { token } from '../../services/passport.js'
import { find, update } from './controller.js'

const router = new express.Router()

router.get('/',
  token(),
  find)

router.put('/',
  token(),
  update)

export default router
