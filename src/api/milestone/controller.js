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
