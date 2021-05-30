import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)
const types = ['feature', 'bug', 'chore']
const states = ['newTicket', 'prioritized', 'yippee', 'readyFordeploy']

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
  projectId: {
    type: Number,
    required: true,
    index: true
  },
  epicId: {
    type: Number,
    required: true,
    index: true
  },
  state: {
    type: String,
    enum: states,
    required: true,
    default: 'newTicket',
    index: true
  },
  requesterId: {
    type: Number,
    required: true,
    index: true
  },
  ownerId: {
    type: Number,
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
  followerIds: [{
    type: Number,
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

storySchema.virtual('project', {
  ref: 'Project',
  localField: 'projectId',
  foreignField: 'id',
  justOne: true
})

storySchema.virtual('epic', {
  ref: 'Epic',
  localField: 'epicId',
  foreignField: 'id',
  justOne: true
})

storySchema.virtual('requester', {
  ref: 'User',
  localField: 'requesterId',
  foreignField: 'id',
  justOne: true
})

storySchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: 'id',
  justOne: true
})

storySchema.virtual('followers', {
  ref: 'User',
  localField: 'followerIds',
  foreignField: 'id',
  justOne: false
})

const model = mongoose.model('Story', storySchema)

export const schema = model.schema
export default model