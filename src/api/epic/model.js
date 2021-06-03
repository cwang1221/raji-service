import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)
const states = ['notStarted', 'inProgress', 'readyForDev', 'done']

const epicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
    index: true
  },
  state: {
    type: String,
    enum: states,
    default: 'notStarted',
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000
  }
}, {
  timestamps: true
})

epicSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })
epicSchema.plugin(AutoIncrement, {
  id: 'epic_seq',
  inc_field: 'id',
  reference_fields: ['tenant']
})

epicSchema.virtual('stories', {
  ref: 'Story',
  localField: 'id',
  foreignField: 'epicId',
  justOne: false
})

const model = mongoose.model('Epic', epicSchema)

export const schema = model.schema
export default model
