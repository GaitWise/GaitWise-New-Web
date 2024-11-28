import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

import { dbConnect } from '@/db/models'
import Walking from '@/db/models/walking'

export async function POST(req: NextRequest) {
  await dbConnect()

  const { participantId } = await req.json()

  if (!participantId) {
    return NextResponse.json({ message: 'Participant ID is required.', success: false }, { status: 400 })
  }

  if (!mongoose.Types.ObjectId.isValid(participantId)) {
    return NextResponse.json({ message: 'Invalid Participant ID format.', success: false }, { status: 400 })
  }

  const objectId = new mongoose.Types.ObjectId(participantId.trim())

  const walkingData = await Walking.findOne({ participant: objectId })
    .populate('acc')
    .populate('gyro')
    .populate('rot')
    .select('acc gyro rot event_time step_count createdAt')

  if (!walkingData) {
    return NextResponse.json(
      { message: 'No data found for the given participant ID.', success: false },
      { status: 404 }
    )
  }

  const responseData = {
    acc: walkingData.acc,
    gyro: walkingData.gyro,
    rot: walkingData.rot,
    event_time: walkingData.event_time,
    step_count: walkingData.step_count,
    createdAt: walkingData.createdAt,
  }

  return NextResponse.json({ success: true, data: responseData })
}
