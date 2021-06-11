import { success, notFound, error } from '../../services/response.js'
import Milestone from './model.js'

export const find = function ({ tenant, querymen: { query, select, option } }, res, next) {
  Milestone.byTenant(tenant)
    .find(query, select, option)
    .then(success(res))
    .catch(next)
}

export const findOne = function ({ tenant, params: { id } }, res, next) {
  Milestone.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}

export const create = function ({ tenant, body }, res, next) {
  Milestone.byTenant(tenant)
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
  Milestone.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(milestone => milestone ? Object.assign(milestone, body).save() : null)
    .then(success(res))
    .catch(next)
}

export const destroy = function ({ tenant, params: { id } }, res, next) {
  Milestone.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(milestone => milestone ? milestone.remove() : null)
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

  let queryStates
  if (query.state) {
    queryStates = query.state.$in || [query.state]
  }
  delete query.state

  Milestone.byTenant(tenant)
    .find(query, select, option)
    .populate({
      path: 'epics',
      populate:{
        path: 'stories',
        select: 'owner ownerId state estimate projectId',
        populate:{
          path:'owner',
          select: 'id name picture'
        }
      }
    })
    .lean()
    .then(milestones => {
      milestones = milestones.filter(milestone => milestone.name === 'BACKLOG' || !queryStates || (queryStates && queryStates.includes(milestone.state)))

      milestones.sort((milestone1, milestone2) => {
        if (milestone1.name === 'BACKLOG') {
          return -1
        }
        return milestone1.id - milestone2.id
      })

      milestones.forEach(milestone => {
        milestone.epics.forEach(epic => {
          epic.countOfStories = epic.stories.length
          epic.countOfDoneStories = 0
          epic.countOfInProgressStories = 0

          epic.totalPoint = 0
          epic.projectIds = []
          epic.owners = []

          epic.stories.forEach(story => {
            epic.totalPoint += story.estimate
            epic.projectIds.includes(story.projectId) || epic.projectIds.push(story.projectId)
            story.owner && epic.owners.length < 3 && !epic.owners.some(owner => owner.id === story.owner.id) && epic.owners.push({
              id: story.owner.id,
              name: story.owner.name,
              avatar: story.owner.picture
            })
            story.state === 'completed' && epic.countOfDoneStories++
            story.state === 'inDevelopment' || story.state === 'readyForReview' || story.state === 'readyForDeploy' && epic.countOfInProgressStories++
          })

          delete epic.stories
        })
        queryProjectIds && (milestone.epics = milestone.epics.filter(epic => epic.projectIds.some(id => queryProjectIds.includes(id))))
      })
      return milestones
    })
    .then(success(res))
    .catch(next)
}

export const addEpic = function ({ tenant, body, params: { id } }, res, next) {
  Milestone.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(milestone => {
      if (!milestone) {
        return null
      }

      milestone.epicIds.push(body.epicId)
      return milestone.save()
    })
    .then(success(res))
    .catch(next)
}

