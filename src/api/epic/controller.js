import { success, notFound, error } from '../../services/response.js'
import Epic from './model.js'

export const find = function ({ tenant, querymen: { query, select, option } }, res, next) {
  Epic.byTenant(tenant)
    .find(query, select, option)
    .then(success(res))
    .catch(next)
}

export const findOne = function ({ tenant, params: { id } }, res, next) {
  Epic.byTenant(tenant)
    .findOne({ id })
    .populate('milestone')
    .lean()
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}

export const create = function ({ tenant, body }, res, next) {
  Epic.byTenant(tenant)
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
  Epic.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(epic => epic ? Object.assign(epic, body).save() : null)
    .then(success(res))
    .catch(next)
}

export const destroy = function ({ tenant, params: { id } }, res, next) {
  Epic.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(epic => epic ? epic.remove() : null)
    .then(success(res, 204))
    .catch(next)
}

export const uiList = function ({ tenant, querymen: { query, select, option } }, res, next) {
  let queryProjectIds
  if (query.projectId) {
    queryProjectIds = query.projectId.$in || [query.projectId]
    queryProjectIds = queryProjectIds.map(id => parseInt(id, 10))
  }
  delete query.projectId
  Epic.byTenant(tenant)
    .find(query, select, option)
    .populate('stories')
    .lean()
    .then(epics => {
      epics.forEach(epic => {
        epic.countOfStories = epic.stories.length

        epic.totalPoint = 0
        epic.projectIds = []

        epic.stories.forEach(story => {
          epic.totalPoint += story.estimate
          epic.projectIds.includes(story.projectId) || epic.projectIds.push(story.projectId)
        })

        delete epic.stories
      })
      return queryProjectIds ? epics.filter(epic => epic.projectIds.some(id => queryProjectIds.includes(id))) : epics
    })
    .then(success(res))
    .catch(next)
}
