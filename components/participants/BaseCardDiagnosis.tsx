import Image from 'next/image'
import { BaseCard } from '@/app/types'

const BaseCardDiagnosis = ({
  cardProps,
  stepCount,
  walkingTime,
}: {
  cardProps: BaseCard
  stepCount: number
  walkingTime: string
}) => {
  
  // 하드코딩된 키(cm)와 몸무게(kg)
  const weight = 70; // kg
  const height = 175; // cm

  // BMI 계산 (Height를 m로 변환)
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  const CardWrapper = ({ title, value, unit }: { title: string; value: string | number; unit?: string }) => (
    <div className="rounded-xl bg-blue-50 p-6 shadow-md">
      <Image
        src={cardProps.src}
        width={cardProps.width}
        height={cardProps.height}
        alt={cardProps.alt}
        className="mx-auto mb-4"
      />
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>
      <p className="mt-2 text-3xl font-bold text-blue-600">
        {value}
        {unit && <span className="text-xl font-normal text-gray-500"> {unit}</span>}
      </p>
    </div>
  );

  // 각 조건에 맞는 컴포넌트 렌더링
  if (cardProps.title.match('Heart Rate')) {
    return <CardWrapper title="Walking Time" value={walkingTime} />;
  }

  if (cardProps.title.match('Temperature')) {
    return <CardWrapper title="BMI" value={bmi} />;
  }

  return <CardWrapper title="Step Count" value={stepCount} unit="steps" />;
};

export default BaseCardDiagnosis;
