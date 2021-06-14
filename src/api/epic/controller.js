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

  let queryMilestoneIds
  if (query.milestoneId) {
    queryMilestoneIds = query.milestoneId.$in || [query.milestoneId]
    queryMilestoneIds = queryMilestoneIds.map(id => parseInt(id, 10))
  }
  delete query.milestoneId

  Epic.byTenant(tenant)
    .find(query, select, option)
    .populate({
      path: 'stories',
      select: 'id type state title projectId estimate',
      populate:{
        path: 'project',
        select: 'color'
      }
    })
    .populate({
      path: 'milestone',
      select: 'id name'
    })
    .lean()
    .then(epics => {
      queryProjectIds && (epics = epics.filter(epic => epic.stories.some(story => queryProjectIds.includes(story.projectId))))
      queryMilestoneIds && (epics = epics.filter(epic => queryMilestoneIds.includes(epic.milestone.id)))

      epics.forEach(epic => {
        epic.countOfStories = epic.stories.length
        epic.countOfDoneStories = 0
        epic.countOfInProgressStories = 0
        epic.totalPoint = 0

        epic.stories.forEach(story => {
          epic.totalPoint += story.estimate
          story.state === 'completed' && epic.countOfDoneStories++
          (story.state === 'inDevelopment' || story.state === 'readyForReview' || story.state === 'readyForDeploy') && epic.countOfInProgressStories++
        })
      })

      return epics
    })
    .then(success(res))
    .catch(next)
}
