import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, Walking } from '@/db/models'

export async function POST(req: NextRequest) {
  await dbConnect()

  // クエリパラメータとリクエストボディを取得
  const type = req.nextUrl.searchParams.get('type')
  const { participantId } = await req.json()
  console.log('type:', type)
  console.log('participantId:', participantId)

  // participantId がない場合はエラーを返す
  if (!participantId) {
    return NextResponse.json({ message: 'Participant ID is required.', success: false }, { status: 400 })
  }

  // participantId のフォーマットを検証
  if (!mongoose.Types.ObjectId.isValid(participantId)) {
    return NextResponse.json({ message: 'Invalid Participant ID format.', success: false }, { status: 400 })
  }

  const objectId = new mongoose.Types.ObjectId(participantId.trim())

  if (type === 'list') {
    // `list` の場合の処理
    const walkingList = await Walking.find({ participant: objectId })
      .select('-event_time') // `event_time` を除外
      .select('_id acc gyro rot step_count createdAt') // 必要なフィールドだけ選択
      .lean()

    if (!walkingList || walkingList.length === 0) {
      return NextResponse.json(
        { message: 'No data found for the given participant ID.', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: walkingList })
  } else if (type === 'detail') {
    // `detail` の場合の処理
    const walkingData = await Walking.findOne({ participant: objectId })
      .populate('acc')
      .populate('gyro')
      .populate('rot')
      .select('acc gyro rot event_time step_count createdAt') // 全フィールドを選択
      .lean()

    if (!walkingData) {
      return NextResponse.json(
        { message: 'No data found for the given participant ID.', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: walkingData })
  } else {
    return NextResponse.json(
      { message: "Invalid 'type' parameter. Must be 'list' or 'detail'.", success: false },
      { status: 400 }
    )
  }
}
