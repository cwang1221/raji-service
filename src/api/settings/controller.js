import { success, notFound } from '../../services/response.js'
import Settings from './model.js'

export const find = function ({ tenant }, res, next) {
  Settings.byTenant(tenant)
    .findOne({ code: 'SETTINGS' })
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}

export const update = function ({ tenant, body }, res, next) {
  Settings.byTenant(tenant)
    .findOne({ code: 'SETTINGS' })
    .then(notFound(res))
    .then(settings => settings ? Object.assign(settings, body).save() : null)
    .then(success(res))
    .catch(next)
}
