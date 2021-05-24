import mongoose from 'mongoose'
import mongoTenant from 'mongo-tenant'
import autoIncrement from 'mongoose-sequence'

const AutoIncrement = autoIncrement(mongoose)

const milestoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
    index: true
  }
}, {
  timestamps: true
})

milestoneSchema.plugin(mongoTenant, { tenantIdKey: 'tenant' })
milestoneSchema.plugin(AutoIncrement, {
  id: 'milestone_seq',
  inc_field: 'id',
  reference_fields: ['tenant']
})

const model = mongoose.model('Milestone', milestoneSchema)

export const schema = model.schema
export default model
