// db\models\organization.ts
import mongoose from 'mongoose'

import { getRandomDefaultImage } from '@/utils'

const OrganizationSchema = new mongoose.Schema(
  {
    organization_name: { type: String, required: true, unique: true },
    organization_description: { type: String, default: '' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'project', default: [] }],
    analysts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analyst', default: [] }],
    organization_profile_image: { type: String, default: getRandomDefaultImage }, //무작위 이미지 링크
  },
  {
    timestamps: true,
    collection: 'organization',
    versionKey: false,
  }
)

const Organization = mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema)

export default Organization
