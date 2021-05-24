import express from 'express'
import user from './user/index.js'
import auth from './auth/index.js'
import project from './project/index.js'
import story from './story/index.js'
import epic from './epic/index.js'
import milestone from './milestone/index.js'
import resetPassword from './resetPassword/index.js'

const { Router } = express

const router = new Router()

router.use('/users', user)
router.use('/auth', auth)
router.use('/resetPassword', resetPassword)
router.use('/projects', project)
router.use('/stories', story)
router.use('/epics', epic)
router.use('/milestones', milestone)

export { router as api }
