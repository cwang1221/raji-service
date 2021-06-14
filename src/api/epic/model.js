import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)
const states = ['todo', 'inProgress', 'done']

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
    default: 'todo',
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  followerIds: [{
    type: Number
  }]
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

epicSchema.virtual('milestone', {
  ref: 'Milestone',
  localField: 'id',
  foreignField: 'epicIds',
  justOne: true
})

const model = mongoose.model('Epic', epicSchema)

export const schema = model.schema
export default model
