import { DiagnosisHistory, PatientList } from 'components'

import type { DiagnosisRecord, Diagnostic, Patient, PatientProfileType, User } from '@/app/types'
import { SideTabs } from '@/components/common/SideTabs'
import getAllPatients from '@/lib/services/Patients'

async function fetchProjectData(projectTitle: string) {
  const query = new URLSearchParams({ project_name: projectTitle }).toString()
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN
  const response = await fetch(`${baseUrl}/api/project/pagedetails/?${query}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch data for project: ${projectTitle}`)
  }

  const data = await response.json()
  return data.projectData
}

function getProfileData<Patient>(participant: Patient) {
  const profile: {
    [key: string]: NonNullable<NonNullable<Patient>[Extract<keyof Patient, string>]>
  } = {}

  for (const key in participant) {
    if (participant) {
      const value = participant[key]
      if (value && !Array.isArray(value)) {
        profile[key] = value
      }
    }
  }

  return profile
}

export default async function Home({ params }: { params: { projectTitle: string; username: string } }) {
  const { projectTitle, username } = params
  console.log('SSR params:', projectTitle)
  console.log('SSR params 2:', username)

  // API からプロジェクトデータを取得
  const projectData = await fetchProjectData(projectTitle)

  let participants!: User[]

  if (projectData.participants) {
    participants = projectData.participants
  }
  // 全患者データを取得
  const initialData = await getAllPatients()

  // 条件に合う患者データを探す
  const participant: Patient | undefined = initialData.find((participant) => participant.name.match('Jessica Taylor'))

  // 必要なデータを設定
  let profile!: PatientProfileType
  let diagnosisHistory!: DiagnosisRecord[]
  let diagnoticList!: Diagnostic[]
  let labResults!: Array<string>

  if (participant) {
    profile = getProfileData<Patient>(participant) as PatientProfileType

    if (participant.diagnosis_history) diagnosisHistory = participant.diagnosis_history

    if (participant.diagnostic_list) diagnoticList = participant.diagnostic_list

    if (participant.lab_results) labResults = participant.lab_results
  }

  return (
    <main className="mx-4 mb-8 flex min-h-screen flex-wrap justify-center lg:grid lg:grid-flow-col lg:grid-cols-4 lg:grid-rows-1 lg:gap-x-8">
      <section className="mb-8 lg:mb-0">
        <PatientList participants={participants} projectTitle={projectTitle} />
      </section>
      <section className="col-start-2 col-end-4 mb-8 grid grid-cols-1 gap-8 lg:mb-0">
        <DiagnosisHistory diagnosisHistory={diagnosisHistory} stepCount={0} walkingTime={''} />
      </section>
      <section className="mb-8 grid grid-cols-1 gap-8 lg:mb-0">
        <SideTabs profile={profile} labResults={labResults} />
      </section>
    </main>
  )
}
