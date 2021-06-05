import express from 'express'
import querymen from 'querymen'
import { token } from '../../services/passport.js'
import { find, findOne, create, update, destroy, uiList } from './controller.js'

const router = new express.Router()
const query = querymen.middleware

router.get('/',
  token(),
  query(),
  find)

router.get('/:id',
  token(),
  findOne)

router.post('/',
  token(['admin']),
  create)

router.put('/:id',
  token(['admin']),
  update)

router.delete('/:id',
  token(['admin']),
  destroy)

router.get('/ui/list',
  token(),
  uiList)

export default router
