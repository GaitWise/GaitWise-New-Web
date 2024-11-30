import mongoose from 'mongoose'
import { dbConnect } from '@/db/models'
import { NextRequest, NextResponse } from 'next/server'
import WalkingHistory from '@/db/models/walking'

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { walkingId } = await req.json();

    if (!walkingId || !mongoose.Types.ObjectId.isValid(walkingId)) {
      console.error("Invalid or missing walkingId:", walkingId);
      return NextResponse.json(
        { success: false, message: "Invalid or missing walkingId" },
        { status: 400 }
      );
    }

    const walkingData = await WalkingHistory.findById(walkingId)
      .populate("acc")
      .populate("gyro")
      .populate("rot")
      .select("acc gyro rot event_time walking_time step_count");

    if (!walkingData) {
      console.error("No walking history found for ID:", walkingId);
      return NextResponse.json(
        { success: false, message: "Walking history not found" },
        { status: 404 }
      );
    }

    // Helper function to trim data
    const trimData = (data) => {
      if (!Array.isArray(data) || data.length <= 200) return data; 
      return [...data.slice(100, -100)]; 
    };

    const responseData = {
        acc: {
          accX: trimData(walkingData.acc?.accX || []),
          accY: trimData(walkingData.acc?.accY || []),
          accZ: trimData(walkingData.acc?.accZ || []),
        },
        gyro: {
          gyroX: trimData(walkingData.gyro?.gyroX || []),
          gyroY: trimData(walkingData.gyro?.gyroY || []),
          gyroZ: trimData(walkingData.gyro?.gyroZ || []),
        },
        rot: {
          rotX: trimData(walkingData.rot?.rotX || []),
          rotY: trimData(walkingData.rot?.rotY || []),
          rotZ: trimData(walkingData.rot?.rotZ || []),
        },
        event_time: trimData(walkingData.event_time || []),
        walking_time: walkingData.walking_time,
        step_count: walkingData.step_count,
    };

    const response = NextResponse.json({ success: true, data: responseData });

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Server error occurred:", error);
    return NextResponse.json({ message: "Server error occurred.", success: false }, { status: 500 });
  }
}
