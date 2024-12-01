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
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const WalkingDataChart = ({ eventTime, acc, gyro, rot }) => {
  if (!eventTime || !acc || !gyro || !rot) {
    console.error('Missing data for WalkingDataChart:', { eventTime, acc, gyro, rot })
    return <p>No data available to display.</p>
  }

  const labels = eventTime

  // Helper function to find indices of max and min points
  const findMaxMinIndices = (data) => {
    const maxIndex = data.indexOf(Math.max(...data))
    const minIndex = data.indexOf(Math.min(...data))
    return [maxIndex, minIndex]
  }

  // Helper function to create pointRadius array for max/min points
  const createPointRadiusForMaxMin = (data) => {
    const [maxIndex, minIndex] = findMaxMinIndices(data)
    return data.map((_, index) => (index === maxIndex || index === minIndex ? 5 : 0))
  }

  // Helper function to create point color array for max/min points
  const createPointColorForMaxMin = (data) => {
    const [maxIndex, minIndex] = findMaxMinIndices(data)
    return data.map((_, index) => (index === maxIndex ? 'red' : index === minIndex ? 'blue' : 'rgba(0, 0, 0, 0.3)')) // 최대값 빨강, 최소값 파랑
  }

  // 그래프 생성
  const generateSingleChartData = (label, data, color) => ({
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: false,
        tension: 0.3, // 부드러운 선
        pointRadius: createPointRadiusForMaxMin(data), // 최대/최소 점 크기
        pointHoverRadius: 6, // 호버 시 점 크기 확대
        pointBorderColor: createPointColorForMaxMin(data), // 최대/최소 점 테두리 색상
        pointBackgroundColor: createPointColorForMaxMin(data), // 최대/최소 점 배경 색상
      },
    ],
  })

  // 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Event Time' },
        ticks: { display: false },
        grid: { display: false },
      },
      y: { title: { display: true, text: 'Values' } },
    },
  }

  return (
    <div>
      {[
        ['Acc-X', acc.accX, 'rgba(75, 192, 192, 1)'],
        ['Acc-Y', acc.accY, 'rgba(153, 102, 255, 1)'],
        ['Acc-Z', acc.accZ, 'rgba(255, 159, 64, 1)'],
        ['Gyro-X', gyro.gyroX, 'rgba(255, 99, 132, 1)'],
        ['Gyro-Y', gyro.gyroY, 'rgba(54, 162, 235, 1)'],
        ['Gyro-Z', gyro.gyroZ, 'rgba(255, 206, 86, 1)'],
        ['Rot-X', rot.rotX, 'rgba(75, 192, 192, 1)'],
        ['Rot-Y', rot.rotY, 'rgba(153, 102, 255, 1)'],
        ['Rot-Z', rot.rotZ, 'rgba(255, 159, 64, 1)'],
      ].map(([label, data, color], index) => (
        <div key={index} style={chartStyle}>
          <h2 className="text-center text-lg font-bold" style={titleStyle}>
            {label}
          </h2>
          <Line data={generateSingleChartData(label, data, color)} options={options} />
        </div>
      ))}
    </div>
  )
}

export default WalkingDataChart

const chartStyle = {
  height: '280px',
  marginBottom: '60px',
}

const titleStyle = {
  marginBottom: '15px',
}
