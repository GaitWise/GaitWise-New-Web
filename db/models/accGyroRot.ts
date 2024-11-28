// db\models\accGyroRot.ts
import mongoose from 'mongoose'

// ====== Acc Schema
const AccSchema = new mongoose.Schema(
  {
    accX: { type: [Number], required: true }, // X축 방향의 가속도 데이터
    accY: { type: [Number], required: true }, // Y축 방향의 가속도 데이터
    accZ: { type: [Number], required: true }, // Z축 방향의 가속도 데이터
  },
  {
    timestamps: true, // 타임스탬프
    collection: 'acc', // 컬렉션 이름
    versionKey: false,
  }
)

const Acc = mongoose.models.acc || mongoose.model('acc', AccSchema)

// ====== Gyro Schema
const GyroSchema = new mongoose.Schema(
  {
    gyroX: { type: [Number], required: true }, // X축 방향의 자이로스코프 데이터
    gyroY: { type: [Number], required: true }, // Y축 방향의 자이로스코프 데이터
    gyroZ: { type: [Number], required: true }, // Z축 방향의 자이로스코프 데이터
  },
  {
    timestamps: true, // 타임스탬프
    collection: 'gyro', // 컬렉션 이름
    versionKey: false,
  }
)

const Gyro = mongoose.models.gyro || mongoose.model('gyro', GyroSchema)

// ====== Rot Schema
const RotSchema = new mongoose.Schema(
  {
    rotX: { type: [Number], required: true }, // X축 방향의 회전 데이터
    rotY: { type: [Number], required: true }, // Y축 방향의 회전 데이터
    rotZ: { type: [Number], required: true }, // Z축 방향의 회전 데이터
  },
  {
    timestamps: true, // 타임스탬프
    collection: 'rot', // 컬렉션 이름
    versionKey: false,
  }
)

const Rot = mongoose.models.rot || mongoose.model('rot', RotSchema)

export { Acc, Gyro, Rot }
