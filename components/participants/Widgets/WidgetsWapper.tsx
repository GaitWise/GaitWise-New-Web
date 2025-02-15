'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { User, Walking } from 'types'

import { ResponseData } from '@/app/types/AccGyroRot'
import { SkeletonCard } from '@/components/common/SkeletonCard'

import BmiWidgets from './BmiWidgets'
import StepCountWidgets from './StepCountWidgets'
import WalkingDataChart from './WalkingDataChart'
import { WalkingListSelecter } from './WalkingListSelecter'
import WalkingTimeWidgets from './WalkingTimeWidgets'
import WidgetsMenu from './WidgetsMenu'

type WidgetsWapperProps = {
  walkingHistory: Walking[]
  userData: User
}

export default function WidgetsWapper({ walkingHistory, userData }: WidgetsWapperProps) {
  const LOCAL_STORAGE_KEY = 'activeWidgets'

  const [walkingData, setWalkingData] = useState<ResponseData | null>(null)
  const [selectedWalkingId, setSelectedWalkingId] = useState<string | null>(
    walkingHistory.length > 0 ? walkingHistory[0]._id : null
  )
  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    // 初期化時にローカルストレージから取得
    if (typeof window !== 'undefined') {
      const storedWidgets = localStorage.getItem(LOCAL_STORAGE_KEY)
      return storedWidgets ? JSON.parse(storedWidgets) : []
    }
    return []
  })

  // APIからデータを取得
  const fetchWalkingData = async (walkingId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DOMAIN
      const response = await axios.post(`${baseUrl}/api/project/graph`, { walkingId })
      if (response.status !== 200) throw new Error(`Failed to fetch walking data for ID: ${walkingId}`)
      setWalkingData(response.data.data)
    } catch (error) {
      console.error('Error fetching walking data:', (error as Error).message)
      setWalkingData(null)
    }
  }

  // 初期値のデータを取得
  useEffect(() => {
    if (selectedWalkingId) {
      fetchWalkingData(selectedWalkingId)
    }
  }, [selectedWalkingId])

  // 初期選択を設定
  useEffect(() => {
    if (walkingHistory.length > 0 && !selectedWalkingId) {
      setSelectedWalkingId(walkingHistory[0]._id)
    }
  }, [walkingHistory, selectedWalkingId])

  // アクティブなウィジェットの状態をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeWidgets))
  }, [activeWidgets])

  // グラフの設定をアクティブな項目に基づいてフィルタリング
  const chartConfigs = walkingData
    ? [
        { label: 'ACC-X', data: walkingData.acc.accX, color: 'rgba(75, 192, 192, 1)' },
        { label: 'ACC-Y', data: walkingData.acc.accY, color: 'rgba(153, 102, 255, 1)' },
        { label: 'ACC-Z', data: walkingData.acc.accZ, color: 'rgba(255, 159, 64, 1)' },
        { label: 'Gyro-X', data: walkingData.gyro.gyroX, color: 'rgba(255, 99, 132, 1)' },
        { label: 'Gyro-Y', data: walkingData.gyro.gyroY, color: 'rgba(54, 162, 235, 1)' },
        { label: 'Gyro-Z', data: walkingData.gyro.gyroZ, color: 'rgba(255, 206, 86, 1)' },
        { label: 'Rot-X', data: walkingData.rot.rotX, color: 'rgba(75, 192, 192, 1)' },
        { label: 'Rot-Y', data: walkingData.rot.rotY, color: 'rgba(153, 102, 255, 1)' },
        { label: 'Rot-Z', data: walkingData.rot.rotZ, color: 'rgba(255, 159, 64, 1)' },
      ].filter((config) => activeWidgets.includes(config.label)) // アクティブな項目のみ
    : []

  return (
    <div>
      {walkingHistory && walkingHistory.length > 0 ? (
        <>
          <div className="flex h-10 gap-x-2">
            <WalkingListSelecter
              walkingHistory={walkingHistory}
              selectedId={selectedWalkingId}
              onSelect={(walkingId) => setSelectedWalkingId(walkingId)}
            />
            <WidgetsMenu
              activeWidgets={activeWidgets}
              onUpdate={(updatedActiveWidgets) => setActiveWidgets(updatedActiveWidgets)}
            />
          </div>
          {walkingData ? (
            <>
              <section className="col-span-4 py-4">
                <div>
                  {chartConfigs.map(({ label, data, color }, index) => (
                    <WalkingDataChart
                      key={index}
                      eventTime={walkingData.event_time}
                      data={data}
                      label={label}
                      color={color}
                    />
                  ))}
                </div>
              </section>
              <div className="flex gap-4">
                {/* BMI */}
                {activeWidgets.includes('BMI') && <BmiWidgets userData={userData} />}
                {/* Step Count */}
                {activeWidgets.includes('Step Count') && <StepCountWidgets step_count={walkingData?.step_count} />}
                {/* Walking Time */}
                {activeWidgets.includes('Walking Time') && (
                  <WalkingTimeWidgets walking_time={walkingData?.walking_time.toString()} />
                )}
              </div>
            </>
          ) : (
            <div className="mt-4">
              <SkeletonCard />
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg font-bold">No walking history available</p>
          <p>Please start recording your walks to see data here.</p>
        </div>
      )}
    </div>
  )
}
