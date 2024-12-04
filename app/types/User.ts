import { Weight } from './Weight'

// ====== User Type ======
export type User = {
  _id: string // MongoDB ObjectId
  projects: string[] // 프로젝트 ID 배열
  surveys: string[] // 설문조사 ID 배열
  survey?: string[] // 설문조사 ID 배열
  walking_history: string[] // 걷기 이력 ID 배열
  firstName: string // 사용자의 이름
  lastName: string // 사용자의 성
  gender: string // 성별
  age: number // 나이
  email: string // 이메일 주소
  weight: Weight // 체중 정보 (Weight 타입)
  height: number // 키 (정수형)
  job: string // 직업
  profile_image_url: string // 프로필 이미지 URL
  password: string // 해시화된 비밀번호
  createdAt: Date // 계정 생성 날짜
  updatedAt: Date // 계정 갱신 날짜
}

export type Participant = {
  firstName?: string
  lastName?: string
  gender?: string
  age?: number
  email?: string
  height?: number
  job?: string
  weight?: {
    value: number
    type: string
  }
  survey?: {
    createdAt: string
    custom_survey?: {
      title?: string
      description?: string
      status?: string
      selection?: {
        content?: string
        options?: string[]
        answer?: string[]
      }[]
      text_response?: {
        content?: string
        answer?: string
      }[]
    }
  }[]
}
