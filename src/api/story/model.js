import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const Schema = mongoose.Schema

const AutoIncrement = autoIncrement(mongoose)
const types = ['feature', 'bug', 'chore']
const states = ['newTicker', 'prioritized', 'yippee', 'readyFordeploy']

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: types,
    required: true,
    default: 'feature',
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  epic: {
    type: Schema.ObjectId,
    ref: 'Epic',
    required: true,
    index: true
  },
  state: {
    type: String,
    enum: states,
    required: true,
    default: 'feature',
    index: true
  },
  requester: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true
  },
  estimate: {
    type: Number,
    required: true,
    max: 100,
    min: 1
  },
  due: {
    type: Date
  },
  followers: [{
    type: Schema.ObjectId,
    ref: 'User',
    index: true
  }],
  labels: [{
    type: String,
    maxLength: 100
  }]
}, {
  timestamps: true
})

storySchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })
storySchema.plugin(AutoIncrement, {
  id: 'story_seq',
  inc_field: 'id',
  reference_fields: ['tenant']
})

const model = mongoose.model('Story', storySchema)

export const schema = model.schema
export default model
