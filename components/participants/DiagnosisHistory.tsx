'use client'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

import { BaseCard, DiagnosisRecord } from '@/app/types'
import { diagnosticHistoryCards } from '@/utils/diagnosisMockData'

import BaseCardDiagnosis from './BaseCardDiagnosis'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const DiagnosisHistory = ({ diagnosisHistory, stepCount, walkingTime }: { diagnosisHistory: DiagnosisRecord[]; stepCount: number; walkingTime: string }) => {
  const respiratoryRates = diagnosisHistory.map((history) => history.respiratory_rate.value).reverse()
  const heartRates = diagnosisHistory.map((history) => history.heart_rate.value).reverse()
  const temperatureRates = diagnosisHistory.map((history) => history.temperature.value).reverse()
  const respiratoryRateAverage = Math.floor(
    respiratoryRates.reduce((acc, rate) => acc + rate, 0) / respiratoryRates.length
  )
  const heartRateAverage = Math.floor(heartRates.reduce((acc, rate) => acc + rate, 0) / heartRates.length)
  const temperatureRateAverage = Math.floor(
    temperatureRates.reduce((acc, rate) => acc + rate, 0) / temperatureRates.length
  )

  const historyCards = diagnosticHistoryCards
    .map((card) => {
      if (card.title.match('Respiratory Rate')) return { ...card, value: respiratoryRateAverage }
      if (card.title.match('Heart Rate')) return { ...card, value: heartRateAverage }
      if (card.title.match('Temperature')) return { ...card, value: temperatureRateAverage }
    })
    .filter((element) => element !== undefined) as BaseCard[]

  return (
    <section role="list" className="divide-y divide-gray-100 rounded-3xl bg-white p-5">
      <div className="flex items-center pb-10">
        <h2 className="text-2xl font-medium">User Information</h2>
      </div>
      <section className="mt-5 grid grid-cols-1 grid-rows-1 justify-center gap-5 lg:grid-cols-3">
        {historyCards.map((cardPros, index) => (
          <BaseCardDiagnosis
            key={index}
            cardProps={cardPros}
            stepCount={stepCount}
            walkingTime={walkingTime}
          />
        ))}
      </section>
    </section>
  )
}

export default DiagnosisHistory
