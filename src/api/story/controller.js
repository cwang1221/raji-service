import { success, notFound, error } from '../../services/response.js'
import Story from './model.js'

export const find = function ({ tenant, querymen: { query, select, option } }, res, next) {
  Story.byTenant(tenant)
    .find(query, select, option)
    // .populate('project')
    // .populate('epic')
    // .populate('requester')
    // .populate('owner')
    // .populate('followers')
    .lean()
    .then(success(res))
    .catch(next)
}

export const findOne = function ({ tenant, params: { id } }, res, next) {
  Story.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}

export const create = function ({ tenant, body }, res, next) {
  Story.byTenant(tenant)
    .create(body)
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'ValidationError') {
        error(res, 400, err.message)
      } else {
        next(err)
      }
    })
}

export const update = function ({ tenant, body, params: { id } }, res, next) {
  Story.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(story => {
      if (story) {
        Object.assign(story, body)
        if (body.ownerId === 0) {
          story.ownerId = undefined
        }
        if (body.estimate === -1) {
          story.estimate = undefined
        }

        return story.save()
      }
      return null
    })
    .then(success(res))
    .catch(next)
}

export const destroy = function ({ tenant, params: { id } }, res, next) {
  Story.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(story => story ? story.remove() : null)
    .then(success(res, 204))
    .catch(next)
}

export const uiList = function ({ tenant, querymen: { query, select, option } }, res, next) {
  Story.byTenant(tenant)
    .find(query, select, option)
    .populate({
      path: 'project',
      select: 'id name color'
    })
    .populate({
      path: 'epic',
      select: 'id name'
    })
    .populate({
      path:'owner',
      select: 'id name picture'
    })
    .lean()
    .then(success(res))
    .catch(next)
}
