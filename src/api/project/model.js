import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)
const types = ['web', 'mobile']

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    enum: types,
    default: 'web'
  },
  followerIds: [{
    type: Number,
    index: true
  }]
}, {
  timestamps: true
})

projectSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })
projectSchema.plugin(AutoIncrement, {
  id: 'project_seq',
  inc_field: 'id',
  reference_fields: ['tenant']
})

projectSchema.virtual('stories', {
  ref: 'Story',
  localField: 'id',
  foreignField: 'projectId',
  justOne: false
})

const model = mongoose.model('Project', projectSchema)

export const schema = model.schema
export default model
