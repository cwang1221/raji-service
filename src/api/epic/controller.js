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
