// ====== Walking

export type Walking = {
  _id: string // MongoDB ObjectId
  participant: string // 참가자 ID (User 컬렉션의 관련 ID)
  acc: string // 가속도 데이터 ID (별도의 컬렉션)
  gyro: string // 자이로스코프 데이터 ID (별도의 컬렉션)
  rot: string // 회전 데이터 ID (별도의 컬렉션)
  walking_time: string // 걷기 시간 (형식: "HH:MM:SS" 등)
  step_count: number // 걸음 수
  shose: string // 사용한 신발 정보
  event_time: Date[] // 이벤트 시간 (배열)
  createAt: Date // 레코드 생성 날짜
  updateAt: Date // 레코드 갱신 날짜
}
