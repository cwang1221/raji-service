import { success, notFound, error } from '../../services/response.js'
import Project from './model.js'

export const find = function ({ tenant, querymen: { query, select, option } }, res, next) {
  Project.byTenant(tenant)
    .find(query, select, option)
    .then(success(res))
    .catch(next)
}

export const findOne = function ({ tenant, params: { id } }, res, next) {
  Project.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}

export const create = function ({ tenant, body }, res, next) {
  Project.byTenant(tenant)
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
  Project.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(project => project ? Object.assign(project, body).save() : null)
    .then(success(res))
    .catch(next)
}

export const destroy = function ({ tenant, params: { id } }, res, next) {
  Project.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(project => project ? project.remove() : null)
    .then(success(res, 204))
    .catch(next)
}

export const uiList = function ({ user, tenant }, res, next) {
  Project.byTenant(tenant)
    .find()
    .populate('stories')
    .lean()
    .then(projects => {
      projects.forEach(project => {
        project.countOfStories = project.stories.length
        project.totalPoint = 0
        project.stories.forEach(story => project.totalPoint += story.estimate)
        delete project.stories

        project.isFollowing = project.followerIds.includes(user.id)
        delete project.followerIds
      })
      return projects
    })
    .then(success(res))
    .catch(next)
}
