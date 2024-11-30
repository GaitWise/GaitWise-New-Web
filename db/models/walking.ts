// db\models\walking.ts
import mongoose from 'mongoose'

const WalkingSchema = new mongoose.Schema(
  {
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    acc: { type: mongoose.Schema.Types.ObjectId, ref: 'acc', required: true },
    gyro: { type: mongoose.Schema.Types.ObjectId, ref: 'gyro', required: true },
    rot: { type: mongoose.Schema.Types.ObjectId, ref: 'rot', required: true },
    walking_time: { type: String, required: true },
    step_count: { type: Number, required: true },
    shose: { type: String, required: true },
    event_time: { type: [Date], required: true },
  },
  {
    timestamps: true, // 타임스탬프
    collection: 'walking', // 컬렉션 이름
    versionKey: false,
  }
)

const Walking = mongoose.models.Walking || mongoose.model('Walking', WalkingSchema)

export default Walking