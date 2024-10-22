// db\models\analyst.ts
import mongoose from 'mongoose'

const AnalystSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, default: '' },
    lastname: { type: String, required: true, default: '' },
    email: { type: String, required: true, unique: true, index: true, default: '' },
    password: { type: String, required: true, default: '' },
    analyst_report: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AnalysisReport' }],
  },
  {
    timestamps: true,
    collection: 'analyst',
    versionKey: false,
  }
)

const Analyst = mongoose.models.Analyst || mongoose.model('Analyst', AnalystSchema)

export default Analyst
