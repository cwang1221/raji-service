import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const Schema = mongoose.Schema

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
  },
  milestone: {
    type: Schema.ObjectId,
    ref: 'Milestone',
    required: true,
    index: true
  },
  owners: [{
    type: Schema.ObjectId,
    ref: 'User',
    index: true
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

const model = mongoose.model('Epic', epicSchema)

export const schema = model.schema
export default model
