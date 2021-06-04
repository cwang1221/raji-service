import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'

const settingsSchema = new mongoose.Schema({
  code: {
    type: String
  },
  timePerTopic: {
    type: Number
  }
}, {
  timestamps: true
})

settingsSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })

const model = mongoose.model('Settings', settingsSchema)

export const schema = model.schema
export default model
