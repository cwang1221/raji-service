import express from 'express'
import querymen from 'querymen'
import { token } from '../../services/passport.js'
import { find, findOne, create, update, destroy, uiList } from './controller.js'

const router = new express.Router()
const query = querymen.middleware

router.get('/',
  token(),
  query({
    state: { type: [String] }
  }),
  find)

router.get('/:id',
  token(),
  findOne)

router.post('/',
  token(),
  create)

router.put('/:id',
  token(),
  update)

router.delete('/:id',
  token(),
  destroy)

router.get('/ui/list',
  token(),
  query({
    state: { type: [String] },
    projectId: { type: [Number] },
    milestoneId: { type: [Number] }
  }),
  uiList)

export default router
